import BackButton from "../../components/Buttons/BackButton";
import { useParams } from "react-router-dom";
import useJobFetcher from "../../utils/Hooks/useJobFetcher";
import { useEffect, useState } from "react";
import InfoSection from "../../components/postedJobDashboard/InfoSection";
import ApplicantsSection from "../../components/postedJobDashboard/ApplicantsSection";
import EditSection from "../../components/postedJobDashboard/EditSection";
import useImageFetcher from "../../utils/Hooks/useImageFetcher";
import type { Job } from "../../../types";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

interface JobDetails extends Job {
  workerId: number;
  worker: {
    name: string;
    gender: string;
    profilePicUrl: string;
  };
}

export const TabIndex = {
  INFO: 0,
  APPLICANTS: 1,
  EDIT: 2,
} as const;

type TabIndex = (typeof TabIndex)[keyof typeof TabIndex];

const PostedJobDashboard = () => {
  const { id } = useParams();
  const { fetchJobByIdForClient } = useJobFetcher();
  const { getImageUrl } = useImageFetcher();

  const [jobDetails, setJobDetails] = useState<JobDetails | undefined>();
  const [mapAnimated, setMapAnimated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabIndex>(TabIndex.INFO);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await fetchJobByIdForClient(id);
        setJobDetails(data);
      }
    };
    fetchData();
  }, [id]);

  const imageUrls =
    jobDetails?.assets
      ?.filter(
        (file) =>
          file.fileType === "image" &&
          file.filePosition !== "thumbnail" &&
          file.fileName
      )
      .map((file) => getImageUrl(file.fileName, "jobAssets")) || [];

  const isActive = (tab: TabIndex) =>
    activeTab === tab ? "bg-white text-black" : "bg-transparent text-white";

  const TabButtonStyle = "px-6 py-2 rounded-2xl text-lg inter-medium";

  return (
    <div className="w-full min-h-screen bg-[#fafafa] flex justify-center">
      {/* Centered max-width wrapper */}
      <div className="w-full max-w-3xl flex flex-col relative pb-6">
        {/* Banner Swiper */}
        <div className="h-60 overflow-hidden bg-black/10 relative">
          {/* Back Button */}
          <div className="absolute pt-4 px-4 z-50">
            <BackButton navigateTo="/profile/jobs" />
          </div>
          {/* Banner Swiper */}
          <div className="h-60  overflow-hidden">
            {imageUrls.length > 1 ? (
              <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                loop
                className="w-full h-full"
              >
                {imageUrls.map((src, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={src}
                      alt={`Job Image ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : imageUrls.length === 1 ? (
              imageUrls.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt="Job Image"
                  className="w-full h-full object-contain"
                />
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                No images available
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-between bg-[#282727] p-4 gap-2 text-white rounded-b-2xl">
          <button
            className={`${TabButtonStyle} ${isActive(TabIndex.INFO)}`}
            onClick={() => setActiveTab(TabIndex.INFO)}
          >
            Info
          </button>
          <button
            className={`${TabButtonStyle} ${isActive(TabIndex.APPLICANTS)}`}
            onClick={() => setActiveTab(TabIndex.APPLICANTS)}
          >
            Applicants
          </button>
          <button
            className={`${TabButtonStyle} ${isActive(TabIndex.EDIT)}`}
            onClick={() => setActiveTab(TabIndex.EDIT)}
          >
            Edit
          </button>
        </div>

        {/* Dynamic Content */}
        <div className=" mx-2 mt-8 bg-white rounded-3xl shadow-[0_6px_25px_rgba(0,0,0,0.08)] p-5">
          {activeTab === TabIndex.INFO && jobDetails && (
            <InfoSection
              {...jobDetails}
              mapAnimated={mapAnimated}
              setMapAnimated={setMapAnimated}
            />
          )}

          {activeTab === TabIndex.APPLICANTS && id && (
            <ApplicantsSection id={id} />
          )}

          {activeTab === TabIndex.EDIT && jobDetails && (
            <EditSection {...jobDetails} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PostedJobDashboard;
