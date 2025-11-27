const ChatShimmer = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="flex flex-col space-y-3  ">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`max-w-[55%] h-8 rounded-2xl shimmer animate-shimmerMove ${
            idx % 2 === 0 ? "self-start" : "self-end"
          } `}
          style={{
            width: `${30 + Math.random() * 45}%`,
            background: idx % 2 === 0 ? "#e5e7eb" : "#d1d5db",
          }}
        />
      ))}
    </div>
  );
};

export default ChatShimmer;
