import { api } from "./api";

export const jobApi = api.injectEndpoints({
  endpoints: (builder) => ({
    fetchMyJobs: builder.query({
      query: () => ({
        url: "/jobs/me",
      }),
      providesTags: ["Jobs"],
      transformResponse: (res) => res.data,
    }),
    fetchJobByIdForPublic: builder.query({
      query: (id: string) => ({
        url: `/jobs/${id}`,
      }),
      providesTags: ["Jobs"],
      transformResponse: (res) => res.data,
    }),
    fetchJobByIdForClient: builder.query({
      query: (id: string) => ({
        url: `/clients/jobs/${id}`,
      }),
      providesTags: ["Jobs"],
      transformResponse: (res) => res.data,
    }),
    fetchJobByIdForWorker: builder.query({
      query: (id: string) => ({
        url: `/workers/jobs/${id}`,
      }),
      providesTags: ["Jobs"],
      transformResponse: (res) => res.data,
    }),
    fetchTaskById: builder.query({
      query: (id: string) => ({
        url: `/jobs/${id}`,
      }),
      providesTags: ["Tasks"],
      transformResponse: (res) => res.data,
    }),
    fetchMyTasks: builder.query({
      query: () => ({
        url: "/users/tasks",
      }),
      providesTags: ["Tasks"],
      transformResponse: (res) => res.data,
    }),
  }),
});

export const {
  useFetchMyJobsQuery,
  useFetchJobByIdForPublicQuery,
  useFetchJobByIdForClientQuery,
  useFetchJobByIdForWorkerQuery,
  useFetchTaskByIdQuery,
  useFetchMyTasksQuery,
} = jobApi;
