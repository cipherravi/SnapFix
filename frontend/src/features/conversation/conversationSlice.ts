import { createSlice } from "@reduxjs/toolkit";

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

const initialState: ConversationState = {
  conversations: [],
  unreadCount: null,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    clearConversations: (state) => {
      state.conversations = [];
    },
    markConversationRead: (state, action) => {
      const conversationId = action.payload;

      const conv = state.conversations.find((c) => c.id === conversationId);

      if (conv) {
        conv.unreadCount = 0;
      }

      // Optionally update total unread count
      state.unreadCount = state.conversations.reduce(
        (sum, c) => sum + c.unreadCount,
        0
      );
    },

    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    clearUnreadCount: (state) => {
      state.unreadCount = null;
    },
    updateSingleConversation: (state, action) => {
      const updated = action.payload;
      const index = state.conversations.findIndex(
        (conv) => conv.id === updated.id
      );

      if (index !== -1) {
        state.conversations[index] = {
          ...state.conversations[index],
          ...updated,
        };
      } else {
        // if it wasn't in the list, add it
        state.conversations.push(updated);
      }
    },
  },
});

export const {
  setConversations,
  clearConversations,
  setUnreadCount,
  clearUnreadCount,
  markConversationRead,
  updateSingleConversation,
} = conversationSlice.actions;
export default conversationSlice.reducer;
