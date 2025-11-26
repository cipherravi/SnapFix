const JobsShimmer = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-white px-4 sm:px-6 md:px-10 py-6 animate-fadeIn overflow-hidden">
      {/* Header Skeleton */}
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-2">
        <div className="w-12 h-12 bg-gray-200 rounded-full shimmer"></div>
        <div className="w-48 h-8 bg-gray-200 rounded-md shimmer mt-2"></div>
        <div className="w-64 h-4 bg-gray-200 rounded-md shimmer mt-1"></div>
      </div>

      {/* Filters Skeleton */}
      <div className="w-full max-w-3xl mx-auto flex gap-2 overflow-x-auto hide-scrollbar mb-4 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-20 h-8 bg-gray-200 rounded-2xl shimmer shrink-0"
          ></div>
        ))}
      </div>

      {/* Task Cards Skeleton */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-full p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-2 shimmer"
            >
              <div className="w-3/4 h-5 bg-gray-200 rounded shimmer"></div>
              <div className="w-full h-3 bg-gray-200 rounded shimmer mt-2"></div>
              <div className="w-1/2 h-3 bg-gray-200 rounded shimmer mt-1"></div>
              <div className="w-24 h-6 bg-gray-200 rounded-full mt-3 shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobsShimmer;
