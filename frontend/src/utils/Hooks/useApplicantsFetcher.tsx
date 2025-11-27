const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from "react-redux";

const useApplicantsFetcher = () => {
  const token = useSelector((s: any) => s.auth.token);

  const fetchApplicants = async (id: number | string) => {
    const res = await fetch(
      `${VITE_API_BASE_URL}/api/v1/jobs/${id}/applicants`,
      {
        // credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    return data?.data || [];
  };

  return fetchApplicants;
};

export default useApplicantsFetcher;
