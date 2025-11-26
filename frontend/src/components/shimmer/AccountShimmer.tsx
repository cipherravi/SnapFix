const AccountShimmer = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-white px-4">
      {/* Centered Wrapper */}
      <div className="w-full max-w-3xl mx-auto flex flex-col pt-6 pb-20">
        {/* BACK BUTTON */}
        <div className="mb-4">
          <div className="w-12 h-12 rounded-full" />
        </div>

        {/* PROFILE + INFO CARD */}
        <div className="w-full flex flex-col items-center mt-4">
          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center gap-3">
            <div className=" w-28 h-28 rounded-full bg-gray-200 shimmer animate-shimmerMove" />
            <div className="w-32 h-6 bg-gray-200 rounded-md mt-1 shimmer animate-shimmerMove" />
          </div>

          {/* MAIN ACCOUNT CARD */}
          <div
            className="
              w-full max-w-2xl mt-6 bg-white rounded-3xl
              shadow-[0_10px_35px_rgba(0,0,0,0.07)]
              border border-gray-100
              p-6 sm:p-8 flex flex-col gap-6 
            "
          >
            {/* REPEATING FIELDS */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                {/* Label */}
                <div className="w-24 h-4 bg-gray-200 rounded-md shimmer animate-shimmerMove" />
                {/* Value */}
                <div className="w-full h-6 bg-gray-200 rounded-lg shimmer animate-shimmerMove" />
              </div>
            ))}

            {/* KYC */}
            <div className="mt-2 flex flex-col gap-2">
              <div className="w-16 h-4 bg-gray-200 rounded-md shimmer animate-shimmerMove" />
              <div className="w-32 h-6 bg-gray-200 rounded-lg shimmer animate-shimmerMove" />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="w-full max-w-3xl flex justify-center gap-5 mt-10 mb-10">
            <div className="w-1/3 h-12 bg-gray-200 rounded-3xl shimmer animate-shimmerMove" />
            <div className="w-1/3 h-12 bg-gray-200 rounded-3xl shimmer animate-shimmerMove" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountShimmer;
