import { useState } from "react";

const Search = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="w-full min-h-screen bg-white pt-4 flex flex-col gap-6 px-4 sm:px-6 md:px-10">
      {/* Heading aligned with search bar */}
      <div className="flex flex-col gap-2 w-full max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl poppins-semibold">Search</h1>
        <p className="text-gray-600 text-sm sm:text-base poppins-light">
          Find jobs, posts, or opportunities that match your interest
        </p>
      </div>

      {/* Search bar */}
      <div className="w-full flex justify-center">
        <div className="relative w-full max-w-3xl">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <img src="/svg/search.svg" alt="Search" className="h-6 w-6" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Jobs"
            className="bg-[#F4F4F4] rounded-xl h-12 w-full pl-12 pr-4 text-lg sm:text-xl focus:outline-none focus:ring transition"
          />
        </div>
      </div>

      {/* Dynamic contents */}
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-2">
        {search && (
          <p className="text-gray-500 text-sm sm:text-base">
            Showing results for: <span className="font-semibold">{search}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;
