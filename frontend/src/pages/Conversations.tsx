import { useEffect, useState } from "react";
import { useConversation } from "../utils/context/CoversationContext";
import ChatCard from "../components/ChatCard";
import { formatTime } from "../utils/formatTime";

const Conversations = () => {
  const [search, setSearch] = useState("");
  const [firstLoad, setFirstLoad] = useState(false);

  const { conversations, fetchConversations, setConversations, loading } =
    useConversation();

  useEffect(() => {
    const visitedBefore = sessionStorage.getItem("visited");
    if (!visitedBefore) {
      setFirstLoad(true);
      sessionStorage.setItem("visited", "true");
    } else {
      setFirstLoad(false);
    }

    fetchConversations();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("visited"); // reset on reload
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const markAsRead = (id: string) => {
    const updated = conversations.map((conv) =>
      conv.id === id ? { ...conv, unreadCount: 0 } : conv
    );
    setConversations(updated);
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 bg-white pt-4 px-4 sm:px-6 md:px-8">
      {/* Heading */}
      <div className="w-full flex flex-col gap-3 max-w-3xl md:max-w-full">
        <h1 className="text-2xl md:text-3xl poppins-semibold text-left">
          Chats
        </h1>

        {/* Search bar */}
        <div className="relative w-full max-w-3xl md:max-w-full mx-auto">
          <img
            src="/svg/search.svg"
            alt="Search"
            className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-5 w-5"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full bg-[#F4F4F4] rounded-xl h-10 pl-10 pr-4 text-base md:text-lg focus:outline-none focus:ring"
          />
        </div>
      </div>

      {/* Chats */}
      <div className="w-full flex-1 relative">
        {conversations.length > 0 ? (
          conversations.map((conv) => (
            <ChatCard
              id={conv.id}
              lastMessage={conv.lastMessage.text ?? "Say Hello 👋"}
              lastMessageTime={formatTime(conv.lastMessage.createdAt)}
              name={conv.participant.name}
              key={conv.id}
              unreadCount={conv.unreadCount}
              markAsRead={markAsRead}
            />
          ))
        ) : (
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500">
            No conversations yet
          </p>
        )}
        <div className="h-32" /> {/* Spacer equal to navbar height */}
      </div>
    </div>
  );
};

export default Conversations;
