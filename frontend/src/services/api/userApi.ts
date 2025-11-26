import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/users/me",
      providesTags: ["User"],
      transformResponse: (res) => res.data, // extract "data"
    }),
  }),
});

export const { useGetProfileQuery } = userApi;
