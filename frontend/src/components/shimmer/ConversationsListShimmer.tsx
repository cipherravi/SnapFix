const ConversationsListShimmer = () => {
  return (
    <div className="w-full h-full flex flex-col gap-6 bg-white  animate-pulse">
      {/* Conversations List */}
      <div className="w-full flex-1 relative flex flex-col gap-4 1">
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

export default ConversationsListShimmer;
