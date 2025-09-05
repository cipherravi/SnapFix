const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useAddressFetcher = () => {
  const fetchAddresses = async () => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/addresses`, {
      credentials: "include",
    });
    const data = await res.json();
    return data?.data || [];
  };
  const fetchAddress = async (id: string) => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/addresses/${id}`, {
      credentials: "include",
    });
    const data = await res.json();
    return data?.data || [];
  };

  return { fetchAddresses, fetchAddress };
};

export default useAddressFetcher;
