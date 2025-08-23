import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../components/Buttons/BackButton";
import useIsMobile from "../utils/Hooks/useIsMobile";
import { useSocket } from "../utils/context/SocketContext";
import { useConversation } from "../utils/context/CoversationContext";
import { useUserInfo } from "../utils/context/UserInfoContext";
import useMessageFetcher from "../utils/Hooks/useMessageFetcher";

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

const Chat = ({ verified = true }: ChatProps) => {
  const { id } = useParams();
  const { conversations } = useConversation();
  const { userData } = useUserInfo();
  const currentConversation = conversations.find((conv) => conv.id === id);
  const user = currentConversation?.participant;
  const isMobile = useIsMobile();
  const { fetchMessages, loading } = useMessageFetcher();
  const socket = useSocket();

  // State and Refs
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // ⬇️ Fetch initial messages
  useEffect(() => {
    if (!id) return;

    const loadMessages = async () => {
      const fetched = await fetchMessages({ conversationId: id });
      setMessages(fetched.reverse());
      setShouldScrollToBottom(true);
    };
    if (userData?.id) {
      socket.emit("markAsRead", id, userData?.id.toString());
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
      setMessages((prev) => [...prev, msg]);
      setShouldScrollToBottom(true);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.emit("joinRoom", id);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      if (userData?.id) {
        socket.emit("markAsRead", id, userData?.id.toString());
      }
      socket.emit("leaveRoom", id);
    };
  }, [socket, id]);

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

  // To check whether text is just emoji's or not
  const isOnlyEmojis = (text: string) => {
    const emojiRegex =
      /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base})+$/gu;
    return emojiRegex.test(text.trim());
  };

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-16 bg-[#6B6B6B] flex items-center gap-4 shadow-md shrink-0">
        <BackButton
          navigateTo="/conversations"
          imgUrl="/svg/dropdown-arrow.svg"
          bgColor="#6B6B6B"
          rotateDegree="90deg"
        />
        <img
          src="/svg/profile.svg"
          alt="Profile Pic"
          className="w-10 h-10 p-2 rounded-full border border-white bg-white"
        />
        <h1 className="text-2xl inter-regular text-white truncate max-w-1/2">
          {user?.name}
        </h1>
        {verified && (
          <img
            src="/svg/verified.svg"
            alt="Verified icon"
            className="w-6 h-6"
          />
        )}
      </div>

      {/* Chat Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-3 bg-gray-100 flex flex-col"
      >
        {messages.map((msg, index) => {
          const onlyEmoji = isOnlyEmojis(msg.text || "");
          return (
            <div
              key={msg._id ?? msg.localId ?? msg.createdAt?.toString() ?? index}
              className={`max-w-[70%] px-4 py-2 rounded-lg shadow break-words whitespace-pre-wrap
              ${
                msg?.senderId === userData?.id
                  ? onlyEmoji
                    ? "bg-transparent text-4xl self-end shadow-none px-0 py-0"
                    : "bg-blue-500 text-white self-end text-sm"
                  : onlyEmoji
                  ? "bg-transparent text-4xl self-start shadow-none px-0 py-0"
                  : "bg-white text-black self-start text-sm"
              }
            `}
            >
              {msg.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Footer */}
      <div className="bg-[#6B6B6B] w-full px-4 py-2 flex items-end gap-2 shrink-0">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message"
          className="flex-1 bg-gray-100 px-4 py-2 rounded-2xl outline-none resize-none overflow-y-auto max-h-32"
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
          className="bg-blue-500 text-white px-4 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
