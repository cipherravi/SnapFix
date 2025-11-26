const ShimmerBlock = ({ className = "" }) => (
  <div className={`bg-gray-200/60 animate-pulse rounded-xl ${className}`}></div>
);

const KycShimmer = () => {
  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <div className="pt-4 px-4 sm:px-6 md:px-8 w-full max-w-3xl mx-auto flex flex-col gap-4">
        {/* BackButton shimmer */}
        <div className="w-12 h-12 rounded-full  animate-pulse"></div>
      </div>

      {/* MAIN */}
      <div className="px-4 sm:px-6 md:px-8 py-6 w-full flex-1 overflow-y-auto flex justify-center">
        <div className="w-full max-w-3xl flex flex-col gap-10">
          {/* GLASS CARD */}
          <div
            className="
              w-full bg-white/80 backdrop-blur-xl border border-gray-200
              rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)]
              p-6 sm:p-10 flex flex-col gap-10
            "
          >
            {/* SECTION 1 — ID PROOF */}
            <div className="flex flex-col gap-4">
              <ShimmerBlock className="w-40 h-6" />

              <div className="flex gap-4">
                <ShimmerBlock className="w-32 h-24 rounded-xl" />
                <ShimmerBlock className="w-32 h-24 rounded-xl" />
              </div>
            </div>

            {/* SECTION 2 — SELFIE */}
            <div className="flex flex-col gap-4">
              <ShimmerBlock className="w-48 h-6" />

              <ShimmerBlock className="w-32 h-28 rounded-xl" />
            </div>

            {/* SECTION 3 — ADDRESS */}
            <div className="flex flex-col gap-4">
              <ShimmerBlock className="w-48 h-6" />
              <ShimmerBlock className="w-full h-12 rounded-xl" />
            </div>
          </div>

          {/* BUTTON */}
          <div className="w-full flex justify-center">
            <ShimmerBlock className="w-40 h-12 rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycShimmer;
