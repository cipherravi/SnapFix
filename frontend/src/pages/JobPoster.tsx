import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import useJobFetcher from "../utils/Hooks/useJobFetcher";
import useImageFetcher from "../utils/Hooks/useImageFetcher";
import BackButton from "../components/Buttons/BackButton";
import MapDisplay from "../components/map/MapDisplay";
import { formatTime } from "../utils/formatTime";

import toast from "react-hot-toast";
import "swiper/css";
import "swiper/css/pagination";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import type { Job } from "../../types";
import ApplyJobModal from "../components/modals/ApplyJobModal";

const JobPoster = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchJobByIdForPublic } = useJobFetcher();
  const { getImageUrl } = useImageFetcher();

  const [jobDetails, setJobDetails] = useState<Job | undefined>();
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) return;
      const data = await fetchJobByIdForPublic(id);
      setJobDetails(data);
    };

    fetchJobDetails();
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

  const applyHandler = async () => {
    try {
      if (applying) return;
      setApplying(true);

      const response = await fetch(
        `${VITE_API_BASE_URL}/api/v1/jobs/${id}/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ message }),
        }
      );

      const data = await response.json();
      if (response.status === 403) {
        navigate("/profile/wallet");
      }
      if (response.ok) {
        toast.success(data.message);
      } else {
        if (data.message == "Token not found") {
          toast.error("Login your account for applying job");
          navigate("/profile");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error("An error occurred while applying.");
    } finally {
      setShowMessageModal(false);
      setApplying(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-white relative">
      {/* Back Button */}
      <div className="absolute top-4 left-3 z-10">
        <BackButton navigateTo="/explore" />
      </div>

      {/* Banner Swiper */}
      <div className="relative w-full h-60 rounded-b-4xl overflow-hidden bg-gray-200">
        {/* Prevent BackButton shift by reserving space */}
        <div className="absolute top-4 left-3 w-8 h-8"></div>

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
                  alt=""
                  className="w-full h-full object-contain aspect-4/3"
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : imageUrls.length === 1 ? (
          <img
            src={imageUrls[0]}
            alt=""
            className="w-full h-full object-contain aspect-4/3"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            No images available
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-6 p-5">
        {/* Title & Apply */}
        <div className="flex justify-between items-start gap-4">
          <h1
            className={`text-2xl poppins-semibold flex-1 cursor-pointer ${
              isTitleExpanded ? "whitespace-normal" : "truncate"
            }`}
            onClick={() => setIsTitleExpanded((prev) => !prev)}
            title="Click to expand/collapse"
          >
            {jobDetails?.title}
          </h1>

          <button
            className="px-5 py-2 rounded-xl bg-[#0385C2] text-white inter-semibold hover:bg-[#0274aa] transition-all"
            onClick={() => setShowMessageModal(true)}
          >
            Apply
          </button>
        </div>

        <ApplyJobModal
          isOpen={showMessageModal}
          onConfirm={applyHandler}
          onCancel={() => {
            setShowMessageModal(false);
          }}
          message="Send custom message to client which will increase chances of your selection"
          setMessage={setMessage}
        />

        {/* Budget & Posted Date */}
        <div className="flex flex-col gap-2 text-gray-700 text-[16px]">
          <p>
            <strong>Budget:</strong> ₹{jobDetails?.budget}
          </p>
          <p>
            <strong>Posted:</strong> {formatTime(jobDetails?.createdAt)}
          </p>
        </div>

        {/* Description */}
        <div
          className={`text-gray-800 text-sm leading-relaxed cursor-pointer ${
            isDescExpanded ? "whitespace-pre-wrap" : "line-clamp-4"
          }`}
          onClick={() => setIsDescExpanded((prev) => !prev)}
          title="Click to expand/collapse"
        >
          <strong>Description:</strong>{" "}
          {jobDetails?.description || "No description provided."}
        </div>

        {/* Address */}
        {jobDetails?.initialAddress && (
          <div className="text-gray-700 text-sm">
            <strong>Address:</strong> {jobDetails.initialAddress}
          </div>
        )}

        {/* Map Section */}
        {jobDetails?.latitude &&
          jobDetails?.longitude &&
          !isNaN(Number(jobDetails.latitude)) &&
          !isNaN(Number(jobDetails.longitude)) && (
            <>
              <MapDisplay
                location={[
                  Number(jobDetails.latitude),
                  Number(jobDetails.longitude),
                ]}
                animateOnLoad={true}
              />

              <a
                href={`https://www.google.com/maps?q=${jobDetails.latitude},${jobDetails.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
              >
                Track on Google Maps
              </a>
            </>
          )}
      </div>
    </div>
  );
};

export default JobPoster;
