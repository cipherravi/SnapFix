const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useWorkerDetailFetcher = (workerId: number) => {
  const fetchWokerDetailById = async () => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/users/${workerId}`, {
      credentials: "include",
    });
    const data = await res.json();
    return data?.data || [];
  };

  return fetchWokerDetailById;
};

export default useWorkerDetailFetcher;
