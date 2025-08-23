const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useCategoryFetcher = () => {
  const fetchCategories = async () => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/categories`, {
      credentials: "include",
    });
    const data = await res.json();
    return data?.data || [];
  };

  return fetchCategories;
};

export default useCategoryFetcher;
