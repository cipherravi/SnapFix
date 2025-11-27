const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from "react-redux";

const useJobFetcher = () => {
  const token = useSelector((s: any) => s.auth.token);

  const fetchMyJobs = async () => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/jobs/me`, {
      credentials: "include",
    });
    const data = await res.json();

    return data?.data || [];
  };
  const fetchJobByIdForPublic = async (id: string) => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/jobs/${id}`, {
      // credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    return data?.data || [];
  };
  const fetchJobByIdForClient = async (id: string) => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/clients/jobs/${id}`, {
      // credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    return data?.data || [];
  };
  const fetchJobByIdForWorker = async (id: string) => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/workers/jobs/${id}`, {
      // credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    return data?.data || [];
  };

  return {
    fetchMyJobs,
    fetchJobByIdForPublic,
    fetchJobByIdForClient,
    fetchJobByIdForWorker,
  };
};

export default useJobFetcher;
