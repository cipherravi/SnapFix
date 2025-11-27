const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from "react-redux";
const useTaskFetcher = () => {
  const token = useSelector((s: any) => s.auth.token);
  const fetchMyTasks = async () => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/users/tasks`, {
      // credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data?.data || [];
  };
  const fetchTaskById = async (id: string) => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/jobs/${id}`, {
      // credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    return data?.data || [];
  };

  return { fetchMyTasks, fetchTaskById };
};

export default useTaskFetcher;
