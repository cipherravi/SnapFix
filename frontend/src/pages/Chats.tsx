import { useEffect, useState } from "react";
import { useConversation } from "../utils/context/CoversationContext";
import ChatCard from "../components/ChatCard";
import { formatTime } from "../utils/formatTime";
import ChatsLoading from "../components/shimmer/ChatsLoading";

const Message = () => {
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
    <div className="w-full h-full flex flex-col gap-10 bg-white pt-4 px-3  ">
      {/* Heading */}
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-3xl pl-2  poppins-semibold ">Chats</h1>

        <div className="w-full flex justify-center relative">
          <img
            src="/svg/search.svg"
            alt="Search"
            className="absolute left-7 top-1/2 transform -translate-y-1/2 h-6 w-6"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="bg-[#F4F4F4] rounded-xl h-10 w-11/12 pl-12 pr-4 text-xl focus:outline-none focus:ring"
          />
        </div>
      </div>

      {/* Chats */}
      <div className="w-full h-full relative">
        {firstLoad && loading ? (
          <div className="w-full h-full flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <ChatsLoading key={idx} />
            ))}
          </div>
        ) : conversations.length > 0 ? (
          conversations.map((conv) => {
            return (
              <ChatCard
                id={conv.id}
                lastMessage={conv.lastMessage.text ?? "Say Hello 👋"}
                lastMessageTime={formatTime(conv.lastMessage.createdAt)}
                name={conv.participant.name}
                key={conv.id}
                unreadCount={conv.unreadCount}
                markAsRead={markAsRead}
              />
            );
          })
        ) : (
          <p className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
            No conversations yet
          </p>
        )}
      </div>
    </div>
  );
};

export default Message;
