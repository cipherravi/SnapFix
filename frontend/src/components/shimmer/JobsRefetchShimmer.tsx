import JobCardShimmer from "./JobCardShimmer";

const JobsRefetchShimmer = () => {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 mt-4">
      {[1, 2, 3, 4].map((_, idx) => (
        <JobCardShimmer key={idx} />
      ))}
    </div>
  );
};

export default JobsRefetchShimmer;
