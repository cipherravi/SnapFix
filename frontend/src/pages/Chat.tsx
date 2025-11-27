import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../components/Buttons/BackButton";
import useIsMobile from "../utils/Hooks/useIsMobile";
import { useSocket } from "../utils/context/SocketContext";
import { useConversation } from "../utils/context/CoversationContext";

import { useSelector } from "react-redux";
import useMessageFetcher from "../utils/Hooks/useMessageFetcher";
import ChatShimmer from "../components/shimmer/ChatShimmer";

type ChatProps = {
  verified?: boolean;
};

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
    // fallback for older iOS
    (window.navigator as any).standalone === true;
  return isIOS && isStandalone;
};

const Chat = ({ verified = true }: ChatProps) => {
  const { id } = useParams();
  const { conversations } = useConversation();

  const userData = useSelector((s: any) => s.user.userData);
  const currentConversation = conversations.find((conv) => conv.id === id);
  const user = currentConversation?.participant;
  const isMobile = useIsMobile();
  const socket = useSocket();
  const { fetchMessages, loading } = useMessageFetcher();

  // -------------------------
  // Chat states
  // -------------------------
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // -------------------------
  // Voice Call States
  // -------------------------
  const [incomingCall, setIncomingCall] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [remoteUserId, setRemoteUserId] = useState<number | null>(null);
  const [remoteOffer, setRemoteOffer] =
    useState<RTCSessionDescriptionInit | null>(null);

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // -------------------------
  // Create Peer Connection
  // -------------------------
  const createPeer = () => {
    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // {
        //   urls: "turn:openrelay.metered.ca:80",
        //   username: "openrelayproject",
        //   credential: "openrelayproject",
        // },
      ],
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

  // -------------------------
  // Start Call (Caller)
  // -------------------------
  const startCall = async () => {
    if (!socket || !id) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;

    peerRef.current = createPeer();
    stream
      .getTracks()
      .forEach((track) => peerRef.current!.addTrack(track, stream));

    // Create offer
    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);

    socket.emit("send-offer", { offer, conversationId: id });
  };

  // -------------------------
  // Accept Call (Receiver)
  // -------------------------
  const acceptCall = async () => {
    if (!remoteOffer) {
      console.error("No peer or offer to accept");
      return;
    }

    setIncomingCall(false);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;

    peerRef.current = createPeer();
    stream
      .getTracks()
      .forEach((track) => peerRef.current!.addTrack(track, stream));

    // Set remote offer first
    await peerRef.current.setRemoteDescription(remoteOffer!);

    const answer = await peerRef.current.createAnswer();
    await peerRef.current.setLocalDescription(answer);

    socket.emit("call-answer", { answer, conversationId: id });
    setInCall(true);
  };

  // -------------------------
  // Decline call
  // -------------------------
  const declineCall = () => {
    setIncomingCall(false);
    if (remoteUserId) socket.emit("reject-call", { conversationId: id });
  };

  // -------------------------
  // End Call
  // -------------------------
  const endCall = () => {
    setInCall(false);

    peerRef.current?.close();
    peerRef.current = null;

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    if (remoteUserId) socket.emit("end-call", { conversationId: id });
  };

  // -------------------------
  // Socket Events (Voice)
  // -------------------------
  useEffect(() => {
    if (!socket) return;

    // socket.on("incoming-call", ({ from }) => {
    //   setRemoteUserId(from);
    //   setIncomingCall(true);
    // });

    socket.on("call-offer", async ({ offer, from }) => {
      // if this offer is from me → ignore
      if (from === userData?.id) return;
      setRemoteUserId(from);
      setRemoteOffer(offer);
      setIncomingCall(true); // show popup
    });

    socket.on("call-answered", async ({ answer }) => {
      await peerRef.current?.setRemoteDescription(answer);
      setInCall(true);
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await peerRef.current?.addIceCandidate(candidate);
      } catch (e) {
        console.log("ICE error", e);
      }
    });

    socket.on("call-ended", () => endCall());

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
  // Chat logic (unchanged)
  // -------------------------
  // ⬇️ Fetch initial messages
  useEffect(() => {
    if (!id) return;

    const loadMessages = async () => {
      const fetched = await fetchMessages({ conversationId: id });
      setMessages(fetched.reverse());
      setShouldScrollToBottom(true);
    };

    if (userData?.id) {
      socket.emit("markAsRead", id);
    }

    loadMessages();
  }, [id]);

  // ⬆️ Load older messages on scroll to top
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
            const newHeight = container.scrollHeight;
            container.scrollTop = newHeight - prevHeight;
          }, 0);
        } else {
          setHasMore(false);
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [id, messages, loading, hasMore]);

  // 📩 Handle incoming message from socket
  useEffect(() => {
    if (!socket || !id) return;

    const handleReceiveMessage = (msg: Message) => {
      if (msg.conversationId !== id) return; // drop messages for other conv
      setMessages((prev) => [...prev, msg]);
      setShouldScrollToBottom(true);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    // socket.emit("joinRoom", id);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      if (userData?.id) {
        socket.emit("markAsRead", id);
      }
      // socket.emit("leaveRoom", id);
    };
  }, [socket, id]);

  // 🚀 Send message
  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || !socket || !id || !userData?.id) return;

    const newMsg: Message = {
      conversationId: id,
      text: trimmed,
      senderId: userData.id,
      sentAt: new Date(),
      localId: `${Date.now()}-${Math.random()}`, // unique temp key
    };

    setMessages((prev) => [...prev, newMsg]);
    setShouldScrollToBottom(true);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    socket.emit("sendMessage", newMsg);
  }, [input, socket, id, userData?.id]);

  //---------------------------------------------

  // ⬇️ Auto-scroll to bottom
  useEffect(() => {
    if (shouldScrollToBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (shouldScrollToBottom) setShouldScrollToBottom(false);
  }, [shouldScrollToBottom]);

  // ⌨️ Input change + auto-grow
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // To check whether text is just emoji's or not
  const isOnlyEmojis = (text: string) => {
    const emojiRegex =
      /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base})+$/gu;
    return emojiRegex.test(text.trim());
  };

  // -------------------------
  // JSX
  // -------------------------
  return (
    <div className="w-full h-dvh flex flex-col bg-gray-50">
      {/* Header */}
      <div className="h-16 bg-gray-100 flex items-center gap-4 shadow-sm px-4 z-10">
        <BackButton
          navigateTo="/conversations"
          // imgUrl="/svg/dropdown-arrow.svg"
          bgColor="transparent"
          // rotateDegree="90deg"
        />
        <img
          src="/svg/profile.svg"
          alt="Profile Pic"
          className="w-10 h-10 p-1 rounded-full border border-gray-300 bg-white object-cover"
        />
        <h1 className="text-xl font-medium text-gray-800 truncate max-w-[50%]">
          {user?.name}
        </h1>

        {/* Call Button */}
        {!inCall ? (
          <button className="ml-auto bg-green-500 hover:bg-green-600 transition-colors text-white px-4 py-2 rounded-full shadow-sm">
            📞 Call
          </button>
        ) : (
          <button className="ml-auto bg-red-500 hover:bg-red-600 transition-colors text-white px-4 py-2 rounded-full shadow-sm">
            🔴 End
          </button>
        )}
      </div>

      {/* Incoming Call Popup */}
      {incomingCall && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-white shadow-xl p-5 rounded-2xl text-center w-80">
          <p className="text-lg font-medium mb-3">📞 Incoming Call…</p>
          <div className="flex gap-4 justify-center">
            <button className="bg-green-500 hover:bg-green-600 transition-colors text-white px-6 py-2 rounded-full shadow">
              Accept
            </button>
            <button className="bg-red-500 hover:bg-red-600 transition-colors text-white px-6 py-2 rounded-full shadow">
              Decline
            </button>
          </div>
        </div>
      )}

      {/* Chat Area */}
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
            }
          `}
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
            ? {
                paddingBottom: `calc(env(safe-area-inset-bottom) + 10px)`, // <-- important
              }
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

      {/* Hidden audio */}
      <audio id="remoteAudio" autoPlay />
    </div>
  );
};

export default Chat;
