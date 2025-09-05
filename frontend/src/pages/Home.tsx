import { useNavigate } from "react-router-dom";
import { useExploreContext } from "../utils/context/ExploreContext";
import JobCard from "../components/home/JobCard";

function Home() {
  const navigate = useNavigate();
  const { jobs, jobsLoading, categoriesLoading, categories } =
    useExploreContext();

  const categoryButtonStyle =
    "bg-[#F4F4F4] inter-medium px-2 py-1 text-nowrap rounded-xl";
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="w-full flex justify-between items-center px-5 py-7">
        <div className="flex items-center justify-center">
          <h1 className="poppins-bold text-2xl">SnapFix</h1>{" "}
          {/* <img src="/svg/snap.png" alt="Snapfix Snap logo" className="h-10" /> */}
        </div>
        <div className="flex items-center justify-center gap-3">
          <img src="/svg/notification.svg" alt="Notification" className="h-8" />
          <img
            src="/svg/message.svg"
            alt="Message"
            className="h-8"
            onClick={() => navigate("/conversations")}
          />
        </div>
      </div>
      {/* Dynamic */}
      <div className="w-full p-4 flex flex-col gap-3 shrink-0">
        {/* Categories */}
        <div className="w-full">
          <h1 className="poppins-semibold text-xl">Categories</h1>
          <div className="w-full flex gap-2 py-4 overflow-x-auto hide-scrollbar">
            {categoriesLoading == true
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-7 w-24 rounded-full shimmer"
                  ></div>
                ))
              : categories.length > 0
              ? categories.map((category) => {
                  return (
                    <button className={categoryButtonStyle} key={category.id}>
                      {category?.name}
                    </button>
                  );
                })
              : null}
          </div>
        </div>
        {/* Jobs */}
        <div className="shrink">
          <h1 className="poppins-semibold text-xl">Jobs near you</h1>
          {/* Filter */}
          <div className="w-full flex gap-3 py-4">
            <button className={categoryButtonStyle}>Latest</button>
            <button className={categoryButtonStyle}>Sort By</button>
            <button className={categoryButtonStyle}>Filter</button>
          </div>
          {/* Cards */}
          {jobsLoading ? (
            <div className="grid grid-cols-2 gap-2 rounded-2xl pb-20">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="min-h-56 w-full rounded-2xl shimmer"
                ></div>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 rounded-2xl pb-20">
              {jobs.map((job) => {
                const mainAsset = job.JobAssets.find(
                  (file) => file.filePosition === "main"
                );
                const mainUrl = mainAsset?.fileName || "";

                return (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    title={job.title}
                    description={job.description}
                    budget={job.budget}
                    src={mainUrl}
                    createdAt={job.createdAt}
                  />
                );
              })}
            </div>
          ) : (
            <div className="w-full min-h-[300px] flex justify-center items-center">
              <p className="text-gray-500">No Jobs found !!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
