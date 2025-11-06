import { useEffect, useMemo, useState } from "react";
import BackButton from "../../components/Buttons/BackButton";
import useJobFetcher from "../../utils/Hooks/useJobFetcher";
import JobCard from "../../components/profile/JobCard";
import useProfilesFetcher from "../../utils/Hooks/useProfilesFetcher";

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
  const fetchWorkerProfiles = useProfilesFetcher();

  const workerMap = useMemo(() => {
    return Object.fromEntries(workerProfiles.map((user) => [user?.id, user]));
  }, [workerProfiles]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedMyJobs = await fetchMyJobs();
      setMyJobs(fetchedMyJobs);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      //  Extract Unique workerIds
      const workerIds = Array.from(
        new Set(myJobs.map((job) => job.workerId).filter((id) => id != null))
      );

      if (workerIds.length > 0) {
        const fetchedWorkerProfiles = await fetchWorkerProfiles({ workerIds });
        setWorkerProfiles(fetchedWorkerProfiles);
      }
    };

    if (myJobs.length > 0) {
      fetchProfiles();
    }
  }, [myJobs]);

  const buttonStyleClass =
    "bg-[#0385C2] text-white px-4 py-1 rounded-2xl inter-medium";
  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white">
      {/* Header + Filter */}
      <div className="shrink-0 pt-4 px-3 flex flex-col gap-4">
        <BackButton navigateTo="/profile" />
        <h1 className="text-3xl poppins-bold">Jobs</h1>

        <div className="w-full flex justify-start gap-2  overflow-x-auto hide-scrollbar">
          <button className={buttonStyleClass}>All</button>
          <button className={buttonStyleClass}>Active</button>
          <button className={buttonStyleClass}>Completed</button>
          <button className={buttonStyleClass}>Failed</button>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto px-3 py-2 pt-10">
        <div className="w-full max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg mx-auto space-y-4">
          {myJobs.length > 0 ? (
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
