import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${VITE_API_BASE_URL}/api/v1`,
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: () => ({}),
});
