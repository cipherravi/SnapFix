const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const userCityFetcher = () => {
  const fetchCities = async () => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/cities`, {
      credentials: "include",
    });
    const data = await res.json();
    return data?.data || [];
  };

  return fetchCities;
};

export default userCityFetcher;
