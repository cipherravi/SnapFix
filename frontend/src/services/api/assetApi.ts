import { api } from "./api";

export const assetApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchPublicImage: builder.query({
      query: (fileName: string) => `/assets/public/image/${fileName}`,
      providesTags: ["Assets"],
      transformResponse: (res: any) => res.publicUrl,
    }),

    fetchProfileImage: builder.query({
      query: (fileName: string) => `/assets/public/profiles/${fileName}`,
      providesTags: ["Assets"],
      transformResponse: (res: any) => res.publicUrl,
    }),

    fetchPrivateImage: builder.query({
      query: (fileName: string) => `/assets/private/image/${fileName}`,
      providesTags: ["Assets"],
    }),
  }),
});

export const {
  useFetchPublicImageQuery,
  useFetchProfileImageQuery,
  useFetchPrivateImageQuery,
} = assetApi;
