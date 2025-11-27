const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from "react-redux";

const useAreaFetcher = () => {
  const token = useSelector((s: any) => s.auth.token);

  const fetchAreasOfCity = async (cityId: number | string) => {
    const res = await fetch(
      `${VITE_API_BASE_URL}/api/v1/cities/${cityId}/areas`,
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
  return fetchAreasOfCity;
};

export default useAreaFetcher;
