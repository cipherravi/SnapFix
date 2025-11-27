const JobCardShimmer = () => {
  return (
    <div
      className="
        w-full rounded-2xl p-5
        bg-white/80 backdrop-blur-xl 
        border border-gray-200
        shadow-[0_4px_20px_rgba(0,0,0,0.06)]
        flex flex-col gap-5 relative overflow-hidden
      "
    >
      {/* SHIMMER ANIMATION LAYER */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent  animate-shimmerMove" />

      {/* STATUS BADGE */}
      <div className="absolute top-4 right-4 h-6 w-20 bg-gray-200 rounded-full "></div>

      <div className="flex flex-col gap-3 relative z-10">
        {/* Title */}
        <div className="h-5 w-2/3 bg-gray-200 rounded-md shimmer"></div>

        {/* Description */}
        <div className="h-4 w-full bg-gray-200 rounded-md shimmer"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded-md shimmer "></div>

        {/* Info Row */}
        <div className="flex items-center gap-5 pt-1">
          <div className="h-4 w-24 bg-gray-200 rounded-md shimmer"></div>
          <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex justify-between items-center mt-3 relative z-10">
        {/* Payment badge */}
        <div className="h-6 w-32 rounded-full bg-gray-200 shimmer"></div>

        {/* Button Placeholder */}
        <div className="h-9 w-20 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
};

export default JobCardShimmer;
