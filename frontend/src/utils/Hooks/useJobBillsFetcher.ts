import { useState } from "react";
import { useSelector } from "react-redux";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useJobBillsFetcher = () => {
  const [fetching, setFetching] = useState(false);
  const token = useSelector((s: any) => s.auth.token);

  const fetchJobBills = async (id: string | number, paymentMethod: string) => {
    try {
      setFetching(true);

      const query = new URLSearchParams();
      if (paymentMethod) query.append("paymentMethod", paymentMethod);
      const res = await fetch(
        `${VITE_API_BASE_URL}/api/v1/jobs/${id}/charges?${query.toString()}`,
        {
          // credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      return data?.data || [];
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  return { fetchJobBills, fetching };
};

export default useJobBillsFetcher;
