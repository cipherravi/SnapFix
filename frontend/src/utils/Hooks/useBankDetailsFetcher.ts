const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from "react-redux";

const useBankDetailsFetcher = () => {
  const token = useSelector((s: any) => s.auth.token);
  const fetchBankAccounts = async () => {
    try {
      const accounts = await fetch(
        `${VITE_API_BASE_URL}/api/v1/workers/bank-details`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await accounts.json();
      return data.data || [];
    } catch (error) {
      console.log(error);
    }
  };
  return { fetchBankAccounts };
};

export default useBankDetailsFetcher;
