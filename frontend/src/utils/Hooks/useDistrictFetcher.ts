
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useDistrictFetcher = () => {
     const fetchDistrictsOfState = async (stateId: number | string) => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/states/${stateId}/districts`, {
      credentials: "include",
    });
    const data = await res.json();
    return data?.data || [];

}
return fetchDistrictsOfState

}

export default useDistrictFetcher