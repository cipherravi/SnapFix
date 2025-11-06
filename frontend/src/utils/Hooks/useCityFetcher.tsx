const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const useCityFetcher = () => {
  const fetchCitiesOfDistrict = async (districtId: number | string) => {
    const res = await fetch(
      `${VITE_API_BASE_URL}/api/v1/districts/${districtId}/cities`,
      {
        credentials: "include",
      }
    );
    const data = await res.json();
    return data?.data || [];
  };

  return fetchCitiesOfDistrict;
};

export default useCityFetcher;
