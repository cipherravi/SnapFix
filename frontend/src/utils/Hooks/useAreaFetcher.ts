const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useAreaFetcher = () => {
     const fetchAreasOfCity = async (cityId: number | string) => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/cities/${cityId}/areas`, {
      credentials: "include",
    });
    const data = await res.json();
    return data?.data || [];

}
return fetchAreasOfCity

}

export default useAreaFetcher