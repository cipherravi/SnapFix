import { api } from "./api";

export const transactionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: (filters) => ({
        url: "/wallet/transactions",
        params: filters,
      }),
      providesTags: ["Transactions"],
      transformResponse: (res) => res.data,
    }),
  }),
});

export const { useGetTransactionsQuery } = transactionApi;
