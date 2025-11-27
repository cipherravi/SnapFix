import { useEffect, useMemo, useState } from "react";
import BackButton from "../../components/Buttons/BackButton";
import useJobFetcher from "../../utils/Hooks/useJobFetcher";
import JobCard from "../../components/profile/JobCard";
import useProfilesFetcher from "../../utils/Hooks/useProfilesFetcher";
import JobsRefetchShimmer from "../../components/shimmer/JobsRefetchShimmer";

interface MyJob {
  id: number;
  title: string;
  description: string;
  budget: number;
  categoryId: number;
  cityId: number;
  status: string;
  workerId: number;
  userId: number;
}

const PostedJobs = () => {
  const { fetchMyJobs } = useJobFetcher();
  const [myJobs, setMyJobs] = useState<MyJob[]>([]);
  const [workerProfiles, setWorkerProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchWorkerProfiles = useProfilesFetcher();

  const workerMap = useMemo(() => {
    return Object.fromEntries(workerProfiles.map((user) => [user?.id, user]));
  }, [workerProfiles]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // start loading
      const fetchedMyJobs = await fetchMyJobs();
      setMyJobs(fetchedMyJobs);

      // Fetch worker profiles
      const workerIds: number[] = Array.from(
        new Set(
          fetchedMyJobs
            .map((job: MyJob) => job.workerId)
            .filter((id: number | null | undefined): id is number => id != null)
        )
      );

      if (workerIds.length > 0) {
        const fetchedWorkerProfiles = await fetchWorkerProfiles({ workerIds });
        setWorkerProfiles(fetchedWorkerProfiles);
      }

      setLoading(false); // finished loading
    };
    fetchData();
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-white px-4 sm:px-6 md:px-10 py-6">
      {/* Header */}
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-2">
        <BackButton navigateTo="/profile" />
        <h1 className="text-2xl sm:text-3xl poppins-bold">Jobs</h1>
        <p className="text-gray-600 text-sm sm:text-base mb-4">
          Manage your posted jobs and track their progress easily
        </p>
      </div>

      {/* Filters */}
      <div className="w-full max-w-3xl mx-auto flex gap-2 overflow-x-auto hide-scrollbar mb-4">
        <button className="bg-[#0385C2] text-white px-4 py-1 rounded-2xl inter-medium">
          All
        </button>
        <button className="bg-[#515252] text-white px-4 py-1 rounded-2xl inter-medium">
          Active
        </button>
        <button className="bg-[#515252] text-white px-4 py-1 rounded-2xl inter-medium">
          Completed
        </button>
        <button className="bg-[#515252] text-white px-4 py-1 rounded-2xl inter-medium">
          Failed
        </button>
      </div>

      {/* Job Cards */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
          {loading ? (
            <JobsRefetchShimmer />
          ) : myJobs.length > 0 ? (
            myJobs.map((job) => {
              const worker = workerMap[job.workerId];
              return (
                <JobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  description={job.description}
                  status={job.status}
                  budget={job.budget}
                  worker={worker}
                />
              );
            })
          ) : (
            <p className="text-center text-gray-500 mt-24">No Jobs found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostedJobs;
