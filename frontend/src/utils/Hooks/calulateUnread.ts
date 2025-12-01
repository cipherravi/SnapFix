interface Participant {
  id: number;
  name: string;
  profilePic: string;
}

interface LastMessage {
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
  lastMessage: LastMessage;
  unreadCount: number;
}

interface ConversationState {
  conversations: Conversation[];
  unreadCount: number | null;
}

export const calculateUnread = (state: ConversationState) => {
  state.unreadCount = state.conversations.reduce(
    (sum, c) => sum + (c.unreadCount || 0),
    0
  );
};
