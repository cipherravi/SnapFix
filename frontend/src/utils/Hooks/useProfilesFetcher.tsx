const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type fetchProfilesProps = {
  workerIds: number[];
};

const useProfilesFetcher = () => {
  const fetchProfiles = async ({ workerIds }: fetchProfilesProps) => {
    const params = new URLSearchParams();
    workerIds.forEach((id) => params.append("ids", id.toString()));
    const res = await fetch(
      `${VITE_API_BASE_URL}/api/v1/users/profiles?${params.toString()}`,
      {
        credentials: "include",
      }
    );
    const data = await res.json();
    return data?.data || [];
  };
  return fetchProfiles;
};

export default useProfilesFetcher;
