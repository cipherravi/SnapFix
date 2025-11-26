const ConversationsShimmer = () => {
  return (
    <div className="w-full h-full flex flex-col gap-6 bg-white pt-4 px-4 sm:px-6 md:px-8 animate-pulse">
      {/* Heading + Search */}
      <div className="w-full flex flex-col gap-4 max-w-3xl md:max-w-full">
        {/* Title shimmer */}
        <div className="h-7 w-24 bg-gray-200 rounded-lg" />

        {/* Search bar shimmer */}
        <div className="relative w-full max-w-3xl md:max-w-full mx-auto">
          {/* Icon bubble */}
          <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-200 rounded-md" />

          {/* Input */}
          <div className="w-full h-10 bg-gray-200 rounded-xl" />
        </div>
      </div>

      {/* Conversations List */}
      <div className="w-full flex-1 relative flex flex-col gap-4 mt-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="
              w-full max-w-3xl md:max-w-full mx-auto
              flex items-center gap-4
              bg-white
            "
          >
            {/* Profile image shimmer */}
            <div className="w-20 md:w-16 h-14 bg-gray-200 rounded-full" />

            <div className="flex flex-col justify-center gap-2 w-full">
              {/* Name */}
              <div className="w-40 h-4 bg-gray-200 rounded-md" />
              {/* Last message */}
              <div className="w-56 h-4 bg-gray-200 rounded-md" />
            </div>

            {/* Time or unread bubble shimmer */}
            <div className="w-10 h-4 bg-gray-200 rounded-md" />
          </div>
        ))}

        {/* Spacer for bottom navbar */}
        <div className="h-32" />
      </div>
    </div>
  );
};

export default ConversationsShimmer;
