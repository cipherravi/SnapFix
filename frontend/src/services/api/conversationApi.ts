import { api } from "./api";

// Reuse your Conversation types
export interface Participant {
  id: number;
  name: string;
  profilePic: string;
}

export interface LastMessage {
  text: string;
  sender: number;
  createdAt: string;
}

export interface Conversation {
  id: string;
  jobId: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  participant: Participant;
  lastMessage: LastMessage;
  unreadCount: number;
}

export const conversationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<Conversation[], void>({
      query: () => "/conversations",
      transformResponse: (response: any) => response.data ?? [],
      providesTags: ["Conversations"],
    }),

    // optional: manual refresh / updating conversations
    refetchConversations: builder.mutation<Conversation[], void>({
      query: () => ({
        url: "/conversations",
        method: "GET",
      }),
      transformResponse: (response: any) => response.data ?? [],
      invalidatesTags: ["Conversations"],
    }),
    getUnreadCount: builder.query<number, void>({
      query: () => "/conversations/unread-count",
      transformResponse: (response: any) => response.data ?? 0,
      providesTags: ["Conversations"],
    }),
    getConversationById: builder.query<Conversation, string>({
      query: (id) => `/conversations/${id}`,
      transformResponse: (response: any) => response.data,
      providesTags: ["Conversations"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetConversationsQuery,
  useRefetchConversationsMutation,
  useGetUnreadCountQuery,
  useGetConversationByIdQuery,
} = conversationApi;
