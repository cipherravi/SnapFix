import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../components/Buttons/BackButton";
import useIsMobile from "../utils/Hooks/useIsMobile";
import { useSocket } from "../utils/context/SocketContext";
import { useDispatch, useSelector } from "react-redux";
import useMessageFetcher from "../utils/Hooks/useMessageFetcher";
import ChatShimmer from "../components/shimmer/ChatShimmer";
import { useGetConversationByIdQuery } from "../services/api/conversationApi";
import {
  updateSingleConversation,
  setOwnSentMessage,
  markConversationRead,
} from "../features/conversation/conversationSlice";

import { RootState } from "../app/store";
import useImageFetcher from "../utils/Hooks/useImageFetcher";

type ChatProps = { verified?: boolean };
type Message = {
  conversationId: string;
  senderId: number;
  text: string;
  sentAt?: Date;
  createdAt?: Date;
  _id?: string;
  localId?: string;
};

const isIOSPWA = () => {
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true;
  return isIOS && isStandalone;
};

const Chat = ({ verified = true }: ChatProps) => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const conversations = useSelector(
    (s: RootState) => s.conversation.conversations
  );

  const userData = useSelector((s: any) => s.user.userData);
  const currentConversation = conversations.find((conv) => conv.id === id);

  const { data: conversation } = useGetConversationByIdQuery(id!, {
    skip: !id || Boolean(currentConversation),
  });

  useEffect(() => {
    if (conversation) {
      dispatch(updateSingleConversation(conversation));
    }
  }, [conversation]);

  // mark conversation as read
  useEffect(() => {
    dispatch(markConversationRead(id));
  }, []);

  // Use either local Redux OR API fallback
  const effectiveConversation = currentConversation || conversation;
  const user = effectiveConversation?.participant;
  const isMobile = useIsMobile();
  const socket = useSocket();
  const { fetchMessages, loading } = useMessageFetcher();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Voice call
  const [incomingCall, setIncomingCall] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [remoteUserId, setRemoteUserId] = useState<number | null>(null);
  const [remoteOffer, setRemoteOffer] =
    useState<RTCSessionDescriptionInit | null>(null);

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const iceCandidatesBuffer = useRef<RTCIceCandidateInit[]>([]);

  // -------------------------
  // Create Peer
  const createPeer = () => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peer.onicecandidate = (event) => {
      if (event.candidate && id) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          conversationId: id,
        });
      }
    };

    peer.ontrack = (event) => {
      const remoteAudio: any = document.getElementById("remoteAudio");
      remoteAudio.srcObject = event.streams[0];
    };

    return peer;
  };

  const startCall = async () => {
    if (!socket || !id) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;

    peerRef.current = createPeer();
    stream
      .getTracks()
      .forEach((track) => peerRef.current!.addTrack(track, stream));

    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);

    socket.emit("send-offer", { offer, conversationId: id });
  };

  const acceptCall = async () => {
    if (!remoteOffer) return;

    setIncomingCall(false);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;

    peerRef.current = createPeer();
    stream
      .getTracks()
      .forEach((track) => peerRef.current!.addTrack(track, stream));

    await peerRef.current.setRemoteDescription(remoteOffer!);

    // Flush buffered ICE candidates
    for (const candidate of iceCandidatesBuffer.current) {
      try {
        await peerRef.current.addIceCandidate(candidate);
      } catch (e) {
        console.log("Buffered ICE error", e);
      }
    }
    iceCandidatesBuffer.current = [];

    const answer = await peerRef.current.createAnswer();
    await peerRef.current.setLocalDescription(answer);

    socket.emit("call-answer", { answer, conversationId: id });
    setInCall(true);
  };

  const declineCall = () => {
    setIncomingCall(false);
    if (remoteUserId) socket.emit("reject-call", { conversationId: id });
  };

  const endCall = () => {
    setInCall(false);
    peerRef.current?.close();
    peerRef.current = null;

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    if (remoteUserId) socket.emit("end-call", { conversationId: id });
  };

  // -------------------------
  useEffect(() => {
    if (!socket) return;

    socket.on("incoming-call", ({ from }) => {
      setRemoteUserId(from);
      setIncomingCall(true);
    });

    socket.on("call-offer", async ({ offer, from }) => {
      if (from === userData?.id) return;
      setRemoteUserId(from);
      setRemoteOffer(offer);
      setIncomingCall(true);
    });

    socket.on("call-answered", async ({ answer }) => {
      await peerRef.current?.setRemoteDescription(answer);

      // Flush ICE buffer
      for (const candidate of iceCandidatesBuffer.current) {
        try {
          await peerRef.current?.addIceCandidate(candidate);
        } catch (e) {
          console.log("Buffered ICE error", e);
        }
      }
      iceCandidatesBuffer.current = [];

      setInCall(true);
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      if (!peerRef.current) return;

      if (peerRef.current.remoteDescription) {
        try {
          await peerRef.current.addIceCandidate(candidate);
        } catch (e) {
          console.log("ICE error", e);
        }
      } else {
        iceCandidatesBuffer.current.push(candidate);
      }
    });

    socket.on("call-ended", endCall);
    socket.on("call-rejected", () => {
      alert("Call was rejected");
      endCall();
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-offer");
      socket.off("call-answered");
      socket.off("ice-candidate");
      socket.off("call-ended");
      socket.off("call-rejected");
    };
  }, [socket, remoteUserId, remoteOffer]);

  // -------------------------
  // Chat fetching
  useEffect(() => {
    if (!id) return;

    const loadMessages = async () => {
      const fetched = await fetchMessages({ conversationId: id });
      setMessages(fetched.reverse());
      setShouldScrollToBottom(true);
    };

    if (userData?.id) socket.emit("markAsRead", id);

    loadMessages();
  }, [id]);

  // Load older messages
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container || !id || !hasMore) return;

    const handleScroll = async () => {
      if (container.scrollTop === 0 && messages.length > 0 && !loading) {
        const before = messages[0].createdAt?.toString();
        const prevHeight = container.scrollHeight;

        const olderMessages = await fetchMessages({
          conversationId: id,
          before,
        });

        if (olderMessages.length > 0) {
          setMessages((prev) => [...olderMessages.reverse(), ...prev]);
          setShouldScrollToBottom(false);
          setTimeout(() => {
            container.scrollTop = container.scrollHeight - prevHeight;
          }, 0);
        } else {
          setHasMore(false);
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [id, messages, loading, hasMore]);

  // Receive messages
  useEffect(() => {
    if (!socket || !id) return;

    const handleReceiveMessage = (msg: Message) => {
      if (msg.conversationId !== id) return;
      setMessages((prev) => [...prev, msg]);
      setShouldScrollToBottom(true);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      if (userData?.id) socket.emit("markAsRead", id);
    };
  }, [socket, id]);

  // Send message
  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || !socket || !id || !userData?.id) return;

    const newMsg: Message = {
      conversationId: id,
      text: trimmed,
      senderId: userData.id,
      sentAt: new Date(),
      localId: `${Date.now()}-${Math.random()}`,
    };

    setMessages((prev) => [...prev, newMsg]);
    setShouldScrollToBottom(true);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    socket.emit("sendMessage", newMsg);

    dispatch(
      setOwnSentMessage({
        conversationId: id,
        senderId: userData.id,
        text: trimmed,
        createdAt: new Date(),
      })
    );
  }, [input, socket, id, userData?.id]);

  useEffect(() => {
    if (shouldScrollToBottom)
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const isOnlyEmojis = (text: string) => {
    const emojiRegex =
      /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base})+$/gu;
    return emojiRegex.test(text.trim());
  };

  // -------------------------

  const { fetchProfileImage } = useImageFetcher();
  const [profilePicUrl, setProfilePicUrl] = useState<string>();
  const [loadingProfilePic, setLoadingProfilePic] = useState(true);

  useEffect(() => {
    const loadProfilePic = async () => {
      if (!user?.profilePic) {
        // user has no profile pic → show default avatar
        setProfilePicUrl("/svg/profile.svg");
        setLoadingProfilePic(false);
        return;
      }

      // user has a profile pic → start shimmering
      setLoadingProfilePic(true);

      const url = await fetchProfileImage(user.profilePic);

      setProfilePicUrl(url || "/svg/profile.svg");
      setLoadingProfilePic(false);
    };

    loadProfilePic();
  }, [user]);

  return (
    <div className="relative w-full h-dvh flex flex-col bg-gray-50">
      {/* Header */}
      <div className="h-16 bg-gray-100 flex items-center gap-4 shadow-sm px-4 z-10">
        <BackButton navigateTo="/conversations" bgColor="transparent" />

        {loadingProfilePic ? (
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse shadow-md shimmer" />
        ) : (
          <img
            src={profilePicUrl}
            alt="User Pic"
            className={`w-12 h-12 rounded-full object-cover ${
              user?.profilePic ? "" : "outline-1 p-1"
            }`}
          />
        )}
        <h1 className="text-xl font-medium text-gray-800 truncate max-w-[50%]">
          {user?.name}
        </h1>

        {!inCall ? (
          <button
            className="ml-auto bg-green-500 hover:bg-green-600 transition-colors text-white px-4 py-2 rounded-full shadow-sm"
            onClick={startCall}
          >
            📞 Call
          </button>
        ) : (
          <button
            className="ml-auto bg-red-500 hover:bg-red-600 transition-colors text-white px-4 py-2 rounded-full shadow-sm"
            onClick={endCall}
          >
            🔴 End
          </button>
        )}
      </div>

      {/* Incoming Call */}
      {incomingCall && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-white shadow-xl p-5 rounded-2xl text-center w-80 z-50">
          <p className="text-lg font-medium mb-3">📞 Incoming Call…</p>
          <div className="flex gap-4 justify-center">
            <button
              className="bg-green-500 hover:bg-green-600 transition-colors text-white px-6 py-2 rounded-full shadow"
              onClick={acceptCall}
            >
              Accept
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 transition-colors text-white px-6 py-2 rounded-full shadow"
              onClick={declineCall}
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {/* Chat */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3 flex flex-col custom-scrollbar"
      >
        {loading && messages.length === 0 ? (
          <ChatShimmer count={20} />
        ) : (
          messages.map((msg, index) => {
            const onlyEmoji = isOnlyEmojis(msg.text || "");
            const isMe = msg?.senderId === userData?.id;
            return (
              <div
                key={
                  msg._id ?? msg.localId ?? msg.createdAt?.toString() ?? index
                }
                className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm wrap-break-word whitespace-pre-wrap transition-all duration-300
                ${
                  isMe
                    ? onlyEmoji
                      ? "text-5xl self-end bg-transparent shadow-none px-0 py-0 animate-slideUpFade"
                      : "self-end bg-blue-500 text-white text-sm shadow-md animate-slideUpFade"
                    : onlyEmoji
                    ? "text-5xl self-start bg-transparent shadow-none px-0 py-0 animate-slideUpFade"
                    : "self-start bg-white text-gray-800 text-sm shadow-md animate-slideUpFade"
                }`}
              >
                {msg.text}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Footer */}
      <div
        className="bg-gray-100 w-full px-4 py-3 flex items-end gap-2 shrink-0"
        style={
          isIOSPWA()
            ? { paddingBottom: `calc(env(safe-area-inset-bottom) + 10px)` }
            : undefined
        }
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-1 bg-white text-gray-800 px-4 py-3 rounded-2xl outline-none resize-none overflow-y-auto max-h-32 min-h-11 placeholder-gray-400 shadow-sm"
          rows={1}
          onKeyDown={(e) => {
            if (!isMobile && e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-6 py-2 rounded-full font-medium h-11 flex items-center justify-center shadow"
        >
          Send
        </button>
      </div>

      <audio id="remoteAudio" autoPlay />
    </div>
  );
};

export default Chat;
