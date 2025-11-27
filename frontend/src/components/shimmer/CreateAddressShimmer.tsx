const CreateAddressShimmer = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-white items-center px-4 sm:px-6 md:px-10 py-6">
      {/* Header */}
      <div className="w-full max-w-3xl flex flex-col gap-3">
        {/* Back Button */}
        <div className="w-10 h-10 bg-gray-200 rounded-full shimmer animate-shimmerMove"></div>

        {/* Title */}
        <div className="h-7 w-48 bg-gray-200 rounded shimmer animate-shimmerMove"></div>

        {/* Description */}
        <div className="h-4 w-64 bg-gray-200 rounded shimmer animate-shimmerMove"></div>
      </div>

      {/* Input fields */}
      <div className="w-full max-w-3xl flex flex-col gap-3 mt-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-12 w-full rounded-lg bg-gray-200 shimmer animate-shimmerMove"
          ></div>
        ))}

        {/* Dropdown Shimmers */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-12 w-full rounded-lg bg-gray-200 shimmer animate-shimmerMove"
          ></div>
        ))}
      </div>

      {/* Map shimmer */}
      <div className="w-full max-w-3xl mt-6 h-56 sm:h-64 md:h-72 rounded-xl bg-gray-200 shadow-md shimmer animate-shimmerMove"></div>

      {/* Button shimmer */}
      <div className="w-full max-w-3xl flex justify-center mt-6">
        <div className="w-full sm:w-1/2 h-12 rounded-2xl bg-gray-300 shimmer animate-shimmerMove"></div>
      </div>
    </div>
  );
};

export default CreateAddressShimmer;
