const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from "react-redux";

const useAddressFetcher = () => {
  const token = useSelector((s: any) => s.auth.token);

  const fetchAddresses = async () => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/addresses`, {
      // credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data?.data || [];
  };
  const fetchAddress = async (id: string) => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/addresses/${id}`, {
      // credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data?.data || [];
  };

  return { fetchAddresses, fetchAddress };
};

export default useAddressFetcher;
