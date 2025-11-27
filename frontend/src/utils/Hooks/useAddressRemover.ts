const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from "react-redux";

export const useAddressRemover = () => {
  const token = useSelector((s: any) => s.auth.token);

  const removeAddress = async (id: number | string) => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/addresses/${id}`, {
      method: "DELETE",
      // credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data?.data || [];
  };

  return removeAddress;
};
