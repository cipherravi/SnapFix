const AssignedTaskDashboardShimmer = () => {
  return (
    <div className="w-full min-h-screen bg-[#fafafa] flex justify-center">
      <div className="w-full max-w-3xl flex flex-col relative pb-6">
        {/* Banner shimmer */}
        <div className="h-60 bg-gray-200 animate-pulse relative rounded-b-2xl">
          <div className="absolute top-4 left-4 w-10 h-10 bg-white/50 rounded-full animate-pulse" />
        </div>

        {/* Infosection shimmer card */}
        <div className="mx-2 mt-8 bg-white rounded-3xl shadow-[0_6px_25px_rgba(0,0,0,0.08)] p-5">
          {/* Title */}
          <div className="h-7 w-2/3 bg-gray-200 animate-pulse rounded-md mb-4" />

          {/* Budget + date */}
          <div className="flex justify-between mb-6">
            <div className="space-y-3">
              <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="h-4 w-28 bg-gray-200 rounded-md animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 mb-6">
            <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse" />
            <div className="h-4 w-4/5 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-200 rounded-md animate-pulse" />
          </div>

          {/* Address */}
          <div className="h-4 w-1/2 bg-gray-200 rounded-md animate-pulse mb-6" />

          {/* Map placeholder */}
          <div className="w-full h-48 bg-gray-200 animate-pulse rounded-xl mb-4"></div>

          {/* Track button */}
          <div className="h-10 w-40 bg-gray-300 animate-pulse rounded-lg "></div>
        </div>
      </div>
    </div>
  );
};

export default AssignedTaskDashboardShimmer;
