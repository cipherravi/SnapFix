const AddressShimmer = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-white items-center px-4 sm:px-6 md:px-10 py-6">
      {/* Header */}
      <div className="w-full max-w-3xl flex flex-col gap-3">
        {/* BackButton Shimmer */}
        <div className="w-10 h-10 bg-gray-200 rounded-full shimmer animate-shimmerMove"></div>

        {/* Heading */}
        <div className="h-7 w-40 bg-gray-200 rounded shimmer animate-shimmerMove"></div>

        {/* Sub-text */}
        <div className="h-4 w-64 bg-gray-200 rounded shimmer animate-shimmerMove"></div>
      </div>

      {/* Address List */}
      <div className="w-full max-w-3xl flex flex-col gap-4 mt-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-full rounded-xl bg-[#f5f5f5] shadow-md border border-gray-200 p-4 flex items-start gap-4"
          >
            {/* Icon shimmer */}
            <div className="w-10 h-10 rounded-lg bg-gray-200 shimmer animate-shimmerMove"></div>

            {/* Address text shimmer */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-5 w-40 bg-gray-200 rounded shimmer animate-shimmerMove"></div>
              <div className="h-4 w-full bg-gray-200 rounded shimmer animate-shimmerMove"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded shimmer animate-shimmerMove"></div>
            </div>

            {/* Buttons shimmer */}
            <div className="flex flex-col gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-300 shimmer animate-shimmerMove"></div>
              <div className="w-9 h-9 rounded-full bg-gray-300 shimmer animate-shimmerMove"></div>
            </div>
          </div>
        ))}

        {/* Create Address Button Shimmer */}
        <div className="w-full flex justify-center mt-6">
          <div className="w-full sm:w-1/2 h-12 bg-gray-300 rounded-2xl shimmer animate-shimmerMove"></div>
        </div>
      </div>
    </div>
  );
};

export default AddressShimmer;
