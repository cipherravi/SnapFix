import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetConversationsQuery } from "../services/api/conversationApi";
import {
  setConversations,
  markConversationRead,
} from "../features/conversation/conversationSlice";
import ChatCard from "../components/ChatCard";
import { formatTime } from "../utils/formatTime";
import ConversationsListShimmer from "../components/shimmer/ConversationsListShimmer";
import { RootState } from "../app/store";

// Types based on your API
interface Participant {
  id: number;
  name: string;
  profilePic: string | null;
}

interface LastMessage {
  text: string;
  sender: number;
  createdAt: string;
}

interface Conversation {
  id: string;
  active: boolean;
  jobId: number;
  participant: Participant;
  lastMessage: LastMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

const Conversations = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

  const conversations = useSelector(
    (s: RootState) => s.conversation.conversations
  );

  const { data: initialConversations = [], isLoading } =
    useGetConversationsQuery(undefined, {
      skip: !isAuthenticated,
      refetchOnMountOrArgChange: true,
    });

  // Normalize data and store in Redux
  useEffect(() => {
    if (!initialConversations.length) return;

    const normalized: Conversation[] = initialConversations.map((conv) => ({
      ...conv,
      participant: conv.participant ?? {
        id: 0,
        name: "Unknown",
        profilePic: null,
      },
      lastMessage: conv.lastMessage ?? {
        text: "Say Hello 👋",
        sender: 0,
        createdAt: new Date().toISOString(),
      },
    }));

    const isDifferent =
      JSON.stringify(normalized) !== JSON.stringify(conversations);

    if (isDifferent) {
      dispatch(setConversations(normalized));
    }
  }, [initialConversations, conversations, dispatch]);

  const markAsRead = (id: string) => {
    dispatch(markConversationRead(id));
  };

  // Filter safely
  const filtered = conversations.filter((c) =>
    c.participant.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col gap-6 bg-white pt-4 px-4 sm:px-6 md:px-8">
      <div className="w-full flex flex-col gap-3 max-w-3xl md:max-w-full">
        <h1 className="text-2xl md:text-3xl poppins-semibold">Chats</h1>

        {/* Search */}
        <div className="relative w-full">
          <img
            src="/svg/search.svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full bg-[#F4F4F4] rounded-xl h-10 pl-10 pr-4"
          />
        </div>
      </div>

      <div className="w-full flex-1 relative">
        {isLoading && conversations.length === 0 ? (
          <ConversationsListShimmer />
        ) : filtered.length > 0 ? (
          filtered.map((conv) => (
            <ChatCard
              key={conv.id}
              id={conv.id}
              lastMessage={conv.lastMessage.text || "Say Hello 👋"}
              lastMessageTime={formatTime(conv.lastMessage.createdAt)}
              name={conv.participant.name || "Unknown"}
              unreadCount={conv.unreadCount}
              markAsRead={markAsRead}
            />
          ))
        ) : (
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500">
            No conversations yet
          </p>
        )}
      </div>
    </div>
  );
};

export default Conversations;
