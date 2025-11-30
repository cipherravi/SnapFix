import { useParams } from "react-router-dom";
import BackButton from "../../components/Buttons/BackButton";
import InfoSection from "../../components/assignedTaskDashboard/InfoSection";
import useJobFetcher from "../../utils/Hooks/useJobFetcher";
import { useEffect, useState } from "react";
import type { Job } from "../../../types";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import useImageFetcher from "../../utils/Hooks/useImageFetcher";

const AssignedTaskDashboard = () => {
  const { id } = useParams();
  const { fetchJobByIdForWorker } = useJobFetcher();
  const { getImageUrl } = useImageFetcher();
  const [taskDetails, setTaskDetails] = useState<Job | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await fetchJobByIdForWorker(id);
        setTaskDetails(data);
      }
    };
    fetchData();
  }, [id]);

  const imageUrls =
    taskDetails?.assets
      ?.filter(
        (file) =>
          file.fileType === "image" &&
          file.filePosition !== "thumbnail" &&
          file.fileName
      )
      .map((file) => getImageUrl(file.fileName, "jobAssets")) || [];

  return (
    <div className="w-full min-h-screen flex justify-center relative bg-[#fafafa]">
      {/* Centered max-width wrapper */}
      <div className="w-full max-w-3xl flex flex-col relative pb-6">
        <div className="absolute pt-4 px-4 z-50">
          <BackButton navigateTo="/profile/tasks" />
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

        {/* Dynamic Content */}
        <div className=" mx-2 mt-8 bg-white rounded-3xl shadow-[0_6px_25px_rgba(0,0,0,0.08)] p-5">
          {taskDetails && <InfoSection {...taskDetails} />}
        </div>
      </div>
    </div>
  );
};

export default AssignedTaskDashboard;
