const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from "react-redux";

const useWorkerDetailFetcher = (workerId: number) => {
  const token = useSelector((s: any) => s.auth.token);

  const fetchWokerDetailById = async () => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/users/${workerId}`, {
      // credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data?.data || [];
  };

  return fetchWokerDetailById;
};

export default useWorkerDetailFetcher;
