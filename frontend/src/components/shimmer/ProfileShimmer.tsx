const ProfileShimmer = () => {
  return (
    <div className="w-full min-h-screen bg-white pt-14 pb-24 sm:pb-32 flex justify-center">
      <div className="w-full max-w-3xl px-4 sm:px-6 md:px-10 flex flex-col gap-8 items-center">
        {/* Info Shimmer (profile pic + name) */}
        <div className="w-full flex flex-col items-center gap-4 rounded-2xl p-4">
          <div className="flex flex-col items-center gap-3">
            <div className="w-28 h-28 rounded-full bg-gray-200 shimmer animate-shimmerMove"></div>
            <div className="w-32 h-6 bg-gray-200 rounded shimmer animate-shimmerMove"></div>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-12 h-4 bg-gray-200 rounded shimmer animate-shimmerMove"></div>
          </div>
        </div>

        {/* Primary Card Shimmer */}
        <div className="w-full bg-gray-100 rounded-2xl p-6 flex flex-col gap-4 shadow">
          {[1, 2, 3, 4].map((_, idx) => (
            <div
              key={idx}
              className="w-full h-6 bg-gray-200 rounded shimmer animate-shimmerMove"
            ></div>
          ))}
        </div>

        {/* Secondary Card Shimmer */}
        <div className="w-full bg-gray-100 rounded-2xl p-6 flex flex-col gap-4 shadow">
          {[1, 2, 3, 4].map((_, idx) => (
            <div
              key={idx}
              className="w-full h-6 bg-gray-200 rounded shimmer animate-shimmerMove"
            ></div>
          ))}
        </div>

        {/* Logout Button Shimmer */}
        <div className="w-32 h-10 bg-gray-300 rounded-3xl shimmer animate-shimmerMove"></div>
      </div>
    </div>
  );
};

export default ProfileShimmer;
