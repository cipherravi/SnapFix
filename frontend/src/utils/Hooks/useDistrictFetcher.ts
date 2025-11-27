const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from "react-redux";

const useDistrictFetcher = () => {
  const token = useSelector((s: any) => s.auth.token);

  const fetchDistrictsOfState = async (stateId: number | string) => {
    const res = await fetch(
      `${VITE_API_BASE_URL}/api/v1/states/${stateId}/districts`,
      {
        // credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    return data?.data || [];
  };
  return fetchDistrictsOfState;
};

export default useDistrictFetcher;
