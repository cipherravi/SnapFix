const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const useAddressRemover = () => {
      const removeAddress = async (id: number | string ) => {
    const res = await fetch(`${VITE_API_BASE_URL}/api/v1/addresses/${id}`, {
        method:"DELETE",
      credentials: "include",
    });
    const data = await res.json();
    return data?.data || [];
  };

  return removeAddress;
}
