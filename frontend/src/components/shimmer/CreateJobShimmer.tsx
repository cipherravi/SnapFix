const CreateJobShimmer = () => {
  return (
    <div className="w-full min-h-screen bg-white pt-4 flex flex-col gap-8 pb-20 px-4 sm:px-6 md:px-10 animate-fadeIn">
      {/* Heading */}
      <div className="flex flex-col gap-3 w-full max-w-3xl mx-auto">
        <div className="h-7 w-40 bg-gray-200 rounded shimmer animate-shimmerMove"></div>
        <div className="h-4 w-64 bg-gray-200 rounded shimmer animate-shimmerMove"></div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
        {/* Category Dropdown */}
        <div className="h-12 w-full bg-gray-200 rounded-lg shimmer animate-shimmerMove"></div>

        {/* Job Title */}
        <div className="h-12 w-full bg-gray-200 rounded-lg shimmer animate-shimmerMove"></div>

        {/* Budget */}
        <div className="h-12 w-full bg-gray-200 rounded-lg shimmer animate-shimmerMove"></div>

        {/* Address Dropdown */}
        <div className="h-12 w-full bg-gray-200 rounded-lg shimmer animate-shimmerMove"></div>

        {/* Textarea */}
        <div className="min-h-24 h-24 w-full bg-gray-200 rounded-lg shimmer animate-shimmerMove"></div>

        {/* Image uploader (3 box grid) */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-gray-200 shimmer animate-shimmerMove"
            ></div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mx-auto w-full sm:w-1/2 h-12 bg-gray-300 rounded-3xl shimmer animate-shimmerMove"></div>
      </div>
    </div>
  );
};

export default CreateJobShimmer;
