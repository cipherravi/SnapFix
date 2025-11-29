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
import { useSelector } from "react-redux";
import JobPosterShimmer from "../components/shimmer/JobPosterShimmer";

const JobPoster = () => {
  const token = useSelector((s: any) => s.auth.token);

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        if (!id) return;
        const data = await fetchJobByIdForPublic(id);
        setJobDetails(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
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
            Authorization: `Bearer ${token}`,
          },
          // credentials: "include",
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

  return loading ? (
    <JobPosterShimmer />
  ) : (
    <div className="w-full min-h-screen flex flex-col bg-white relative">
      {/* Back Button */}
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-start">
        <div className="mx-auto w-full max-w-3xl px-5">
          <BackButton navigateTo="/explore" />
        </div>
      </div>

      {/* Banner Swiper */}
      <div className="w-full flex justify-center">
        <div
          className="
      relative w-full max-w-3xl h-60 sm:h-64 md:h-72 
      overflow-hidden bg-gray-200 
      rounded-b-4xl  
      shadow-lg
    "
        >
          {/* Reserve space for back button */}
          <div className="absolute top-4 left-0 right-0">
            <div className="px-5 h-8"></div>
          </div>

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
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : imageUrls.length === 1 ? (
            <img
              src={imageUrls[0]}
              alt=""
              className="w-full h-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No images available
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 p-5 w-full max-w-3xl mx-auto">
        {/* Title + Apply */}
        <div className="flex justify-between items-start gap-4">
          <h1
            className={`text-2xl poppins-semibold flex-1 cursor-pointer ${
              isTitleExpanded ? "whitespace-normal" : "truncate"
            }`}
            onClick={() => setIsTitleExpanded((p) => !p)}
          >
            {jobDetails?.title}
          </h1>

          <button
            className="px-5 py-2 rounded-xl bg-[#0385C2] text-white inter-semibold hover:bg-[#0274aa]"
            onClick={() => setShowMessageModal(true)}
          >
            Apply
          </button>
        </div>

        <ApplyJobModal
          isOpen={showMessageModal}
          onConfirm={applyHandler}
          onCancel={() => setShowMessageModal(false)}
          message="Send custom message to client which will increase chances of your selection"
          setMessage={setMessage}
        />

        {/* Budget */}
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
          onClick={() => setIsDescExpanded((p) => !p)}
        >
          <strong>Description: </strong>
          {jobDetails?.description || "No description provided."}
        </div>

        {/* Address */}
        {jobDetails?.initialAddress && (
          <div className="text-gray-700 text-sm">
            <strong>Address:</strong> {jobDetails.initialAddress}
          </div>
        )}

        {/* Map Section */}
        {jobDetails?.latitude && jobDetails?.longitude && (
          <>
            <MapDisplay
              location={[
                Number(jobDetails.latitude),
                Number(jobDetails.longitude),
              ]}
              animateOnLoad
            />

            <a
              href={`https://www.google.com/maps?q=${jobDetails.latitude},${jobDetails.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block px-4 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 text-center"
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
