import { useState } from "react";
import { useSelector } from "react-redux";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type Message = {
  conversationId: string;
  senderId: number;
  text: string;
  sentAt?: Date;
  createdAt?: Date;
  _id: string;
};

type fetchMessagesProps = {
  conversationId: string;
  before?: string;
};

const useMessageFetcher = () => {
  const token = useSelector((s: any) => s.auth.token);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const fetchMessages = async ({
    conversationId,
    before,
  }: fetchMessagesProps): Promise<Message[]> => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (before) query.append("before", before);

      const res = await fetch(
        `${VITE_API_BASE_URL}/api/v1/conversations/${conversationId}/messages?${query.toString()}`,
        {
          // credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      return data?.data || [];
    } catch (err) {
      console.error(err);
      setError("Failed to load messages");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { fetchMessages, loading, error };
};

export default useMessageFetcher;
