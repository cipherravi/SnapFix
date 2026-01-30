import { api } from "./api";

export const workerApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllBankAccounts: builder.query({
      query: () => "/workers/bank-details",
      providesTags: ["Worker"],
      transformResponse: (res) => res.data,
    }),
  }),
});

export const { useGetAllBankAccountsQuery } = workerApi;
