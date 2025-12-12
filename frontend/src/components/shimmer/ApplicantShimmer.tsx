const ApplicantsShimmer = () => {
  return (
    <div className="w-full flex flex-col gap-4 animate-pulse mt-3">
      {/* 3 placeholder applicant cards */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 p-4 rounded-xl bg-white shadow-sm">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gray-300"></div>

          {/* Middle info */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
            <div className="h-3 w-1/4 bg-gray-300 rounded"></div>
            <div className="h-3 w-2/3 bg-gray-300 rounded"></div>
          </div>

          {/* Actions */}
          <div className="flex flex-col justify-center gap-2">
            <div className="h-8 w-20 bg-gray-300 rounded"></div>
            <div className="h-8 w-20 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicantsShimmer;
