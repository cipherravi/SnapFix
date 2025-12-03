import { useNavigate } from "react-router-dom";
import { useExploreContext } from "../utils/context/ExploreContext";
import JobCard from "../components/home/JobCard";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { useGetUnreadCountQuery } from "../services/api/conversationApi";
import { setUnreadCount } from "../features/conversation/conversationSlice";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    jobs,
    jobsLoading,
    categoriesLoading,
    categories,
    fetchMoreJobs,
    hasMore,
  } = useExploreContext();

  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

  const { data: fetchedUnreadCount } = useGetUnreadCountQuery(undefined, {
    skip: !isAuthenticated,
    refetchOnMountOrArgChange: false,
    refetchOnReconnect: false,
    refetchOnFocus: false,
  });

  const unreadCount = useSelector((s: RootState) => s.conversation.unreadCount);

  useEffect(() => {
    if (fetchedUnreadCount !== undefined && unreadCount === undefined) {
      dispatch(setUnreadCount(fetchedUnreadCount));
    }
  }, [fetchedUnreadCount, unreadCount]);

  const [offset, setOffset] = useState(0);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  /* Infinite Scrolling Logic */
  useEffect(() => {
    if (
      jobs.length > 6 &&
      inView &&
      !jobsLoading &&
      !isFetchingMore &&
      hasMore
    ) {
      setIsFetchingMore(true);
      const newOffset = offset + 10;
      setOffset(newOffset);

      fetchMoreJobs(newOffset).finally(() => {
        setIsFetchingMore(false);
      });
    }
  }, [inView, jobsLoading, hasMore, offset, isFetchingMore]);

  /* Initial Load Complete */
  useEffect(() => {
    if (!jobsLoading) {
      setHasLoadedOnce(true);
    }
  }, [jobsLoading]);

  const categoryButtonStyle =
    "bg-[#F4F4F4] inter-medium px-2 py-1 text-nowrap rounded-xl";

  return (
    <div className="w-full h-full flex flex-col bg-white relative" role="main">
      {/* HEADER */}
      <div
        className="w-full flex justify-between items-center px-5 py-3 sticky top-0 bg-white z-30"
        role="banner"
      >
        <div className="flex items-center justify-center">
          <h1 className="poppins-bold text-2xl" aria-label="SnapFix Logo">
            SnapFix
          </h1>
        </div>

        {/* NOTIFICATION + CHAT */}
        <div className="flex items-center justify-center gap-3">
          <button
            aria-label="Notifications"
            className="focus:outline-none focus:ring-2 focus:ring-[#0385C2] rounded-full p-1"
          >
            <img src="/svg/notification.svg" alt="" className="h-8" />
          </button>

          <button
            aria-label={`Messages (${unreadCount} unread)`}
            className="relative focus:outline-none focus:ring-2 focus:ring-[#0385C2] rounded-full p-1"
            onClick={() => navigate("/conversations")}
          >
            {unreadCount > 0 && (
              <span
                aria-label={`${unreadCount} unread messages`}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs 
                min-w-4 h-4 sm:min-w-[18px] sm:h-[18px]
                flex items-center justify-center rounded-full px-[3px] sm:px-[5px] shadow-md"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
            <img src="/svg/message.svg" alt="" className="h-8 sm:h-9" />
          </button>
        </div>
      </div>

      {/* DYNAMIC CONTENT */}
      <div className="w-full p-4 flex flex-col gap-3 shrink-0">
        {/* CATEGORIES SECTION */}
        <section aria-labelledby="categories-heading">
          <h1 id="categories-heading" className="poppins-semibold text-xl">
            Categories
          </h1>

          <div
            className="w-full flex gap-2 py-4 overflow-x-auto hide-scrollbar"
            role="list"
          >
            {categoriesLoading
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-7 w-24 rounded-full shimmer"
                    aria-hidden="true"
                  ></div>
                ))
              : categories.length > 0 &&
                categories.map((category) => (
                  <button
                    key={category.id}
                    className={categoryButtonStyle}
                    role="listitem"
                    aria-label={`Category ${category.name}`}
                  >
                    {category?.name}
                  </button>
                ))}
          </div>
        </section>

        {/* JOBS SECTION */}
        <section aria-labelledby="jobs-heading">
          <h1 id="jobs-heading" className="poppins-semibold text-xl">
            Jobs near you
          </h1>

          {/* FILTER BUTTONS */}
          <div
            className="w-full flex gap-3 py-4"
            role="group"
            aria-label="Job filters"
          >
            <button
              className={categoryButtonStyle}
              aria-label="Show latest jobs"
            >
              Latest
            </button>
            <button className={categoryButtonStyle} aria-label="Sort jobs">
              Sort By
            </button>
          </div>

          {/* INITIAL SHIMMER */}
          {!hasLoadedOnce && jobsLoading && (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 rounded-2xl pb-20"
              aria-live="polite"
            >
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="min-h-56 w-full rounded-2xl shimmer"
                  aria-hidden="true"
                ></div>
              ))}
            </div>
          )}

          {/* JOB LIST */}
          {hasLoadedOnce && jobs.length > 0 && (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 rounded-2xl pb-4 auto-rows-fr"
              role="list"
            >
              {jobs.map((job) => {
                const mainAsset = job.assets.find(
                  (file) => file.filePosition === "thumbnail"
                );
                const mainUrl = mainAsset?.fileName || "";

                return (
                  <div role="listitem" key={job.id}>
                    <JobCard
                      id={job.id}
                      title={job.title}
                      description={job.description}
                      budget={job.budget}
                      src={mainUrl}
                      createdAt={job.createdAt}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* NO JOBS FOUND */}
          {hasLoadedOnce && !jobsLoading && jobs.length === 0 && (
            <div
              className="w-full min-h-[calc(100vh-330px)] flex justify-center items-center"
              aria-live="polite"
            >
              <p className="text-gray-500">No Jobs found !!</p>
            </div>
          )}

          {/* PAGINATION SHIMMER */}
          {jobsLoading && jobs.length > 0 && (
            <div
              className="grid grid-cols-2 gap-2 rounded-2xl pb-20"
              aria-live="polite"
            >
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="min-h-56 w-full rounded-2xl shimmer"
                  aria-hidden="true"
                ></div>
              ))}
            </div>
          )}

          {/* LOAD MORE TRIGGER (Intersection Observer Target) */}
          <div ref={ref} style={{ height: "50px" }} aria-hidden="true"></div>
        </section>
      </div>
    </div>
  );
}

export default Home;
