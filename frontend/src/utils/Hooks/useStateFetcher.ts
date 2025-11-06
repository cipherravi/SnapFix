const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useStateFetcher = () => {
     const fetchStates = async () => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/states`, {
      credentials: "include",
    });
    const data = await res.json();
    return data?.data || [];

}
return fetchStates

}

export default useStateFetcher