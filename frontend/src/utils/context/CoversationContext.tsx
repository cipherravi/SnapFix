import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useSelector } from "react-redux";

// Environment variable
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Define the conversation type (adjust fields based on your API)
interface Participant {
  id: number;
  name: string;
  profilePic: string;
}

interface lastMessage {
  text: string;
  sender: number;
  createdAt: string;
}

interface Conversation {
  id: string;
  jobId: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  participant: Participant;
  lastMessage: lastMessage;
  unreadCount: number;
}

// ✅ Define the shape of the context
interface ConversationContextType {
  conversations: Conversation[];
  fetchConversations: () => Promise<void>;
  loading: boolean;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
}

// ✅ Create the context
const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

// ✅ Define provider props
interface ConversationProviderProps {
  children: ReactNode;
}

const ConversationProvider = ({ children }: ConversationProviderProps) => {
  const token = useSelector((s: any) => s.auth.token);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/v1/conversations`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Unexpected error: ${res.status}`);
      }

      const data = await res.json();

      setConversations(data?.data || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <ConversationContext.Provider
      value={{ conversations, fetchConversations, setConversations, loading }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export default ConversationProvider;

// ✅ Hook to consume the context
export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(
      "useConversation must be used within a ConversationProvider"
    );
  }
  return context;
};
