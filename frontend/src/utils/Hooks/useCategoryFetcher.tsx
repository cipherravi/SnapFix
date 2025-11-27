const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from "react-redux";

const useCategoryFetcher = () => {
  const token = useSelector((s: any) => s.auth.token);

  const fetchCategories = async () => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/categories`, {
      // credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data?.data || [];
  };

  return fetchCategories;
};

export default useCategoryFetcher;
