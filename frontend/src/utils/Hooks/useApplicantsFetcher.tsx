const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useApplicantsFetcher = () => {
  const fetchApplicants = async (id: number | string) => {
    const res = await fetch(
      `${VITE_API_BASE_URL}/api/v1/jobs/${id}/applicants`,
      {
        credentials: "include",
      }
    );

    const data = await res.json();
    return data?.data || [];
  };

  return fetchApplicants;
};

export default useApplicantsFetcher;
