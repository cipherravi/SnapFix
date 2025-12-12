import { useEffect, useMemo, useState } from "react";
import BackButton from "../../components/Buttons/BackButton";
import JobCard from "../../components/profile/JobCard";
import useProfilesFetcher from "../../utils/Hooks/useProfilesFetcher";
import JobsRefetchShimmer from "../../components/shimmer/JobsRefetchShimmer";
import { useFetchMyJobsQuery } from "../../services/api/jobApi";

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

const JOB_STATUS = {
  INITIATED: "initiated",
  POSTED: "posted",
  ASSIGNED: "assigned",
  STARTED: "started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  APPROVED: "approved",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
} as const;

type FilterType = "all" | "active" | "completed" | "failed";

const PostedJobs = () => {
  const [myJobs, setMyJobs] = useState<MyJob[]>([]);
  const [workerProfiles, setWorkerProfiles] = useState<any[]>([]);

  // DEFAULT FILTER = "active"
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("active");

  const fetchWorkerProfiles = useProfilesFetcher();

  const workerMap = useMemo(
    () => Object.fromEntries(workerProfiles.map((u) => [u?.id, u])),
    [workerProfiles]
  );

  const { data: fetchedMyJobs, isLoading } = useFetchMyJobsQuery(undefined);

  useEffect(() => {
    if (!fetchedMyJobs) return;

    setMyJobs(fetchedMyJobs);

    const workerIds = [
      ...new Set(
        fetchedMyJobs
          .map((job: MyJob) => job.workerId)
          .filter((id: number | null): id is number => id != null)
      ),
    ];

    if (workerIds.length === 0) return;

    (async () => {
      const profiles = await fetchWorkerProfiles({
        workerIds: workerIds as number[],
      });
      setWorkerProfiles(profiles);
    })();
  }, [fetchedMyJobs]);

  // ---------------------------
  // FILTER LOGIC
  // ---------------------------
  const filteredJobs = useMemo(() => {
    switch (selectedFilter) {
      case "all":
        return myJobs;

      case "active":
        return myJobs.filter(
          (job) =>
            ![
              JOB_STATUS.APPROVED,
              JOB_STATUS.CANCELLED,
              JOB_STATUS.EXPIRED,
            ].includes(
              job.status as
                | typeof JOB_STATUS.APPROVED
                | typeof JOB_STATUS.CANCELLED
                | typeof JOB_STATUS.EXPIRED
            ) // ACTIVE includes completed now
        );

      case "completed":
        return myJobs.filter((job) => job.status === JOB_STATUS.APPROVED);

      case "failed":
        return myJobs.filter((job) =>
          [JOB_STATUS.CANCELLED, JOB_STATUS.EXPIRED].includes(
            job.status as
              | typeof JOB_STATUS.CANCELLED
              | typeof JOB_STATUS.EXPIRED
          )
        );

      default:
        return myJobs;
    }
  }, [myJobs, selectedFilter]);

  // Button label mapping
  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "failed", label: "Failed" },
  ];

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
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedFilter(key)}
            className={`px-4 py-1 rounded-2xl inter-medium transition-all
            ${
              selectedFilter === key
                ? "bg-[#0385C2] text-white"
                : "bg-[#515252] text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Job Cards */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
          {isLoading ? (
            <JobsRefetchShimmer />
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => {
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
