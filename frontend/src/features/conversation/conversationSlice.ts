import { createSlice } from "@reduxjs/toolkit";
import { calculateUnread } from "../../utils/Hooks/calulateUnread";
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

      // update total unread count
      calculateUnread(state);
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
    setNewMessage: (state, action) => {
      const { conversationId, senderId, text, createdAt } = action.payload;

      const index = state.conversations.findIndex(
        (c) => c.id == action.payload.conversationId
      );

      if (index === -1) return;

      const conversation = state.conversations[index];

      // update last message
      const updatedConversation = {
        ...conversation,
        lastMessage: {
          sender: senderId,
          text,
          createdAt: createdAt || new Date().toISOString(),
        },
        unreadCount: (conversation.unreadCount || 0) + 1,
      };

      // increment unread
      conversation.unreadCount = (conversation.unreadCount || 0) + 1;

      // update total unread count
      calculateUnread(state);

      // reorder: move to top
      state.conversations = [
        updatedConversation,
        ...state.conversations.filter((c) => c.id !== conversationId),
      ];
    },
    setOwnSentMessage: (state, action) => {
      const { conversationId, senderId, text, createdAt } = action.payload;

      const index = state.conversations.findIndex(
        (c) => c.id == action.payload.conversationId
      );

      if (index === -1) return;

      const conversation = state.conversations[index];

      // update last message
      const updatedConversation = {
        ...conversation,
        lastMessage: {
          sender: senderId,
          text,
          createdAt: createdAt || new Date().toISOString(),
        },
      };

      // reorder: move to top
      state.conversations = [
        updatedConversation,
        ...state.conversations.filter((c) => c.id !== conversationId),
      ];
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
  setNewMessage,
  setOwnSentMessage,
} = conversationSlice.actions;
export default conversationSlice.reducer;
