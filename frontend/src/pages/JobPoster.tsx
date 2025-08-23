import { useParams } from "react-router-dom";
import useJobFetcher from "../utils/Hooks/useJobFetcher";
import { useEffect, useState } from "react";
import BackButton from "../components/Buttons/BackButton";
import { formatTime } from "../utils/formatTime";
import MapDisplay from "../components/map/MapDisplay";
import toast from "react-hot-toast";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Job {
  budget: number;
  categoryId: number;
  cityId: number;
  createdAt: string;
  description: string;
  id: number;
  status: string;
  title: string;
  updatedAt: string;
  userId: number;
  workerId: number;
  address: string;
  lat: string;
  lng: string;
}

const JobPoster = () => {
  const { id } = useParams();
  const { fetchJobById } = useJobFetcher();
  const [jobDetails, setJobDetails] = useState<Job | undefined>(undefined);
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await fetchJobById(id);
        setJobDetails(data);
      }
    };
    fetchData();
  }, [id]);

  async function applyHandler() {
    try {
      const response = await fetch(
        `${VITE_API_BASE_URL}/api/v1/jobs/${id}/apply`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occured while applying");
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-white relative">
      {/* Back Button */}
      <div className="absolute top-4 left-3 z-10">
        <BackButton navigateTo="/explore" />
      </div>

      {/* Banner */}
      <div className="w-full h-60 bg-[#f3f3f3] flex items-center justify-center">
        <img
          src="/svg/profile.svg"
          alt="Poster"
          className="h-40 object-contain"
        />
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-6 p-5">
        {/* Title + Apply */}
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
            className="px-5 py-2 rounded-xl bg-[#0385C2] text-white inter-semibold hover:bg-[#0274aa] transition-all "
            onClick={applyHandler}
          >
            Apply
          </button>
        </div>

        {/* Budget & Date */}
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
            isDescExpanded ? "max-h-none whitespace-pre-wrap" : "line-clamp-4"
          }`}
          onClick={() => setIsDescExpanded((prev) => !prev)}
          title="Click to expand/collapse"
        >
          {jobDetails?.description}
        </div>

        {/* Address */}
        <div className="text-gray-700 text-sm">
          <strong>Address:</strong> {jobDetails?.address}
        </div>
        {jobDetails?.lat &&
          jobDetails?.lng &&
          !isNaN(Number(jobDetails?.lat)) &&
          !isNaN(Number(jobDetails?.lng)) && (
            <>
              <MapDisplay
                location={[Number(jobDetails.lat), Number(jobDetails.lng)]}
              />
              <a
                href={`https://www.google.com/maps?q=${jobDetails.lat},${jobDetails.lng}`}
                // href={`https://www.google.com/maps/dir/?api=1&destination=${jobDetails.lat},${jobDetails.lng}`}
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
