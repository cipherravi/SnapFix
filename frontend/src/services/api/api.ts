import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Do not use useSelector here; inject token dynamically in baseQuery
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${VITE_API_BASE_URL}/api/v1`,
    // credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Conversations",
    "Transactions",
    "Assets",
    "Jobs",
    "Tasks",
  ],
  endpoints: () => ({}),
});
