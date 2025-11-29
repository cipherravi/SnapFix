import React from "react";
import TransactionCardShimmer from "./TransactionCardShimmer";

const WalletTransactionShimmer: React.FC = () => {
  const shimmerItems = Array.from({ length: 8 });

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 px-4 sm:px-6 md:px-10 py-6 mt-14">
      {/* Header shimmer */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="h-8 w-1/3 bg-gray-300 rounded-md shimmer animate-shimmerMove"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded-md shimmer animate-shimmerMove"></div>
      </div>

      {/* Filter buttons shimmer */}
      <div className="w-full flex gap-3 overflow-x-auto hide-scrollbar mb-4 ">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-10 w-20 sm:w-24 rounded-2xl bg-gray-300 shrink-0 shimmer animate-shimmerMove"
          />
        ))}
      </div>

      {/* Transaction cards shimmer */}
      <div className="flex flex-col gap-4">
        {shimmerItems.map((_, idx) => (
          <TransactionCardShimmer key={idx} />
        ))}
      </div>
    </div>
  );
};

export default WalletTransactionShimmer;
