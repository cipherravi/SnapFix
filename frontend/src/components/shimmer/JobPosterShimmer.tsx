const JobPosterShimmer = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-white relative animate-pulse">
      {/* Back Button (aligned with content max-w-3xl) */}
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-start">
        <div className="mx-auto w-full max-w-3xl px-5">
          <div className="w-10 h-10 rounded-full bg-gray-300 shimmer animate-shimmerMove"></div>
        </div>
      </div>

      {/* Banner Shimmer (max-w-3xl on desktop) */}
      <div className="w-full flex justify-center">
        <div
          className="
          relative w-full max-w-3xl 
          h-60 sm:h-64 md:h-72 
          bg-gray-200 overflow-hidden 
          rounded-b-4xl md:rounded-2xl 
          md:shadow-lg
        "
        >
          <div className="w-full h-full bg-gray-300 shimmer animate-shimmerMove"></div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full flex justify-center mt-4">
        <div
          className="
          w-full max-w-3xl 
          p-5 flex flex-col gap-6 
          bg-white 
          md:shadow-lg md:rounded-xl
        "
        >
          {/* Title + Apply Button */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="h-6 w-3/4 bg-gray-300 rounded shimmer animate-shimmerMove"></div>
            </div>

            <div className="w-24 h-9 bg-gray-300 rounded-xl shimmer animate-shimmerMove"></div>
          </div>

          {/* Budget + Posted */}
          <div className="flex flex-col gap-3">
            <div className="h-4 w-40 bg-gray-300 rounded shimmer animate-shimmerMove"></div>
            <div className="h-4 w-32 bg-gray-300 rounded shimmer animate-shimmerMove"></div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-3">
            <div className="h-4 w-20 bg-gray-300 rounded shimmer animate-shimmerMove"></div>
            <div className="h-4 w-full bg-gray-300 rounded shimmer animate-shimmerMove"></div>
            <div className="h-4 w-11/12 bg-gray-300 rounded shimmer animate-shimmerMove"></div>
            <div className="h-4 w-5/6 bg-gray-300 rounded shimmer animate-shimmerMove"></div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-2">
            <div className="h-4 w-20 bg-gray-300 rounded shimmer animate-shimmerMove"></div>
            <div className="h-4 w-2/3 bg-gray-300 rounded shimmer animate-shimmerMove"></div>
          </div>

          {/* Map placeholder */}
          <div
            className="
            w-full h-56 sm:h-64 md:h-72 
            bg-gray-300 rounded-xl 
            shimmer animate-shimmerMove
          "
          ></div>

          {/* Track Button */}
          <div className="w-44 h-10 bg-gray-300 rounded-lg shimmer animate-shimmerMove mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default JobPosterShimmer;
