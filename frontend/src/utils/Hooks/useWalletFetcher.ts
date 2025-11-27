import { useEffect, useState, useCallback } from "react";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from "react-redux";

const useWalletFetcher = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const token = useSelector((s: any) => s.auth.token);
  const fetchWallet = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/v1/wallet/balance`, {
        // credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      setData(json?.data || []);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch once on mount
  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  return { data, loading, error, refetch: fetchWallet };
};

export default useWalletFetcher;
