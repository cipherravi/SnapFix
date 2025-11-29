const TransactionCardShimmer = () => {
  return (
    <div
      className="
        relative w-full rounded-2xl p-5 mb-4 
        backdrop-blur-sm bg-gray-100/20 border border-black/10
        overflow-hidden
      "
    >
      {/* SHIMMER OVERLAY */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent  animate-shimmerMove" />

      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {/* Icon Skeleton */}
          <div className="w-11 h-11 rounded-xl bg-white/40 backdrop-blur-md border border-white/50 shimmer" />

          {/* Purpose text skeleton */}
          <div>
            <div className="h-3 w-16 bg-white/40 rounded mb-2 shimmer" />
            <div className="h-5 w-28 bg-white/50 rounded shimmer" />
          </div>
        </div>

        {/* Status Tag skeleton */}
        <div className="h-5 w-16 bg-white/40 rounded-full backdrop-blur-md border border-white/50 shimmer" />
      </div>

      {/* Amount skeleton */}
      <div className="mt-4">
        <div className="h-3 w-14 bg-white/40 rounded mb-2 shimmer" />
        <div className="h-6 w-24 bg-white/50 rounded shimmer" />
      </div>

      {/* Balance boxes */}
      <div className="grid grid-cols-2 gap-4 mt-5">
        {/* Previous Balance */}
        <div className="rounded-xl p-3 bg-white/50 backdrop-blur-lg border border-gray-200/60  animate-shimmerMove">
          <div className="h-3 w-20 bg-white/40 rounded mb-2 shimmer" />
          <div className="h-5 w-20 bg-white/50 rounded shimmer" />
        </div>

        {/* New Balance */}
        <div className="rounded-xl p-3 bg-white/50 backdrop-blur-lg border border-gray-200/60 animate-shimmerMove">
          <div className="h-3 w-20 bg-white/40 rounded mb-2 shimmer" />
          <div className="h-5 w-20 bg-white/50 rounded shimmer" />
        </div>
      </div>

      {/* Date skeleton */}
      <div className="mt-4 border-t border-gray-200 pt-3 animate-shimmerMove">
        <div className="h-3 w-24 bg-white/40 rounded shimmer" />
      </div>
    </div>
  );
};

export default TransactionCardShimmer;
