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

// Define as const to get literal types
export const TabIndex = {
  INFO: 0,
  APPLICANTS: 1,
  EDIT: 2,
} as const;

// Define a union type of the values
type TabIndex = (typeof TabIndex)[keyof typeof TabIndex];

const PostedJobDashboard = () => {
  const { id } = useParams();
  const { fetchJobByIdForClient } = useJobFetcher();
  const { getImageUrl } = useImageFetcher();
  const [jobDetails, setJobDetails] = useState<JobDetails | undefined>(
    undefined
  );

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
    <div className="w-full min-h-screen flex flex-col relative bg-[#fafafa]">
      <div className="shrink-0 pt-4 px-3 flex flex-col gap-4 absolute z-10">
        <BackButton navigateTo="/profile/jobs" />
      </div>
      {/* Banner Swiper */}
      <div className="h-60 rounded-b-4xl overflow-hidden">
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
        ) : imageUrls.length == 1 ? (
          imageUrls.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Job Image`}
              className="w-full h-full object-contain"
            />
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            No images available
          </div>
        )}
      </div>
      {/* Tabs */}
      <div className="flex justify-between bg-[#282727] p-4 gap-2 text-white">
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
      {/* Dynamic  */}
      <div className="shrink w-full h-full">
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
  );
};

export default PostedJobDashboard;
