const WalletShimmer = () => {
  return (
    <div className="w-full h-screen flex flex-col bg-linear-to-b from-[#0F8DD8] to-[#0C6FB0] relative overflow-hidden animate-fadeIn">
      {/* HEADER + BALANCE CARD */}
      <div className="pt-28 px-6 text-white flex flex-col items-center">
        {/* Balance Card Skeleton */}
        <div
          className="
            mt-5 relative w-full max-w-md
            rounded-3xl p-7
            bg-white/10 backdrop-blur-2xl border border-white/20
            shadow-[0_15px_40px_rgba(0,0,0,0.18)]
            overflow-hidden
            shimmer
          "
        >
          {/* Glow */}
          <div className="absolute -top-24 right-0 w-52 h-52 bg-white/20 blur-2xl rounded-full"></div>

          {/* Text */}
          <div className="relative z-20">
            <div className="w-36 h-4 bg-white/20 rounded-md shimmer"></div>

            <div className="flex items-end gap-3 mt-5">
              <div className="w-6 h-10 bg-white/20 rounded shimmer"></div>
              <div className="w-40 h-12 bg-white/20 rounded shimmer"></div>
            </div>

            <div className="w-40 h-3 bg-white/20 rounded mt-4 shimmer"></div>
          </div>

          {/* Progress bar skeleton */}
          <div className="relative z-20 mt-8">
            <div className="h-2 bg-white/20 rounded-full shimmer"></div>
            <div className="w-32 h-3 bg-white/20 rounded mt-3 shimmer"></div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className=" mt-10 flex gap-7 md:gap-15 justify-between px-1">
          <div className="w-32 h-12 bg-white/20 rounded-3xl shimmer"></div>
          <div className="w-32 h-12 bg-white/20 rounded-3xl shimmer"></div>
        </div>
      </div>

      {/* TRANSACTION SECTION */}
      <div className="mt-10 bg-white rounded-t-3xl p-6 h-full overflow-y-auto">
        <div className="w-40 h-6 bg-gray-200 rounded shimmer mb-6"></div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="w-24 h-9 bg-gray-200 rounded-2xl shimmer"></div>
          <div className="w-24 h-9 bg-gray-200 rounded-2xl shimmer"></div>
          <div className="w-24 h-9 bg-gray-200 rounded-2xl shimmer"></div>
        </div>

        {/* Transaction Items */}
        <div className="flex flex-col gap-5 mt-5">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="w-full h-16 bg-gray-200 rounded-2xl shimmer"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletShimmer;
