import { useState } from "react";

const Search = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="w-full h-full bg-white pt-4  flex flex-col gap-10">
      <div className="flex flex-col gap-10 mx-4 ">
        {/* Heading */}

        <h1 className="text-3xl  poppins-semibold ">Search</h1>
      </div>

      {/* Search bar */}
      <div className="w-full flex justify-center relative">
        <img
          src="/svg/search.svg"
          alt="Search"
          className="absolute left-7 top-1/2 transform -translate-y-1/2 h-6 w-6"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Jobs"
          className="bg-[#F4F4F4] rounded-xl h-10 w-11/12 pl-12 pr-4 text-xl focus:outline-none focus:ring"
        />
      </div>

      {/* Dynamic contetns .... */}
    </div>
  );
};

export default Search;
