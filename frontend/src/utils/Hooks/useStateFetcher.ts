const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from "react-redux";

const useStateFetcher = () => {
  const token = useSelector((s: any) => s.auth.token);
  const fetchStates = async () => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/states`, {
      // credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data?.data || [];
  };
  return fetchStates;
};

export default useStateFetcher;
