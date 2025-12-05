import { formatTime } from "../../utils/formatTime";
import { useNavigate } from "react-router-dom";
import useImageFetcher from "../../utils/Hooks/useImageFetcher";
import getDistanceInKm from "../../utils/Hooks/getDistanceInKm";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect, useState } from "react";

interface JobCardProps {
  id: number;
  src?: string;
  title: string;
  description: string;
  budget: number;
  createdAt: string;
  latitude: number;
  longitude: number;
}

const JobCard = ({
  id,
  src,
  title,
  description,
  budget,
  createdAt,
  latitude,
  longitude,
}: JobCardProps) => {
  const navigate = useNavigate();
  const { getImageUrl } = useImageFetcher();
  const url = getImageUrl(src, "jobAssets");
  const userCoords = useSelector((s: RootState) => s.user.userCoords);
  const [distance, setDistance] = useState<number | null>(null);

  const handleClick = () => {
    navigate(`/jobs/${id}/${title.split(" ").join("-")}`);
  };

  useEffect(() => {
    if (userCoords?.[0] && userCoords[1]) {
      const distance = getDistanceInKm(
        userCoords[0],
        userCoords[1],
        latitude,
        longitude
      );
      setDistance(distance);
    }
  }, [userCoords, latitude, longitude]);

  const getDistanceLabel = () => {
    if (distance === null) return null;
    if (distance < 1) return "Near you";
    return `${distance.toFixed(1)} km`;
  };

  const getDistanceColor = () => {
    if (distance === null) return "text-gray-600";
    if (distance < 3) return "text-green-600";
    if (distance < 10) return "text-orange-600";
    return "text-red-600";
  };

  const distanceLabel = getDistanceLabel();
  const distanceColor = getDistanceColor();

  return (
    <div
      className="bg-white rounded-2xl shadow-sm 
        overflow-hidden cursor-pointer 
        transition hover:shadow-md 
        focus:outline-none focus:ring-2 focus:ring-blue-400"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {/* Banner Image */}
      <div className="w-full aspect-4/3 bg-gray-200">
        {url ? (
          <img
            src={url}
            alt={`Job image for ${title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs bg-white">
            No Image Available
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-3 flex flex-col gap-1.5">
        <h2 className="text-base font-semibold text-gray-900 truncate">
          {title}
        </h2>

        <p className="text-xs text-gray-600 truncate">
          {description || "No description provided."}
        </p>

        <div className="flex justify-between items-start pt-1">
          <span className="text-base font-bold text-green-700">₹ {budget}</span>

          <div className="flex flex-col items-end leading-tight gap-1">
            {distanceLabel && (
              <div
                className={`
                flex items-center gap-1 px-2 py-0.5 rounded-full
                bg-white/60 backdrop-blur-md border border-gray-200/60
                shadow-sm text-[10px] font-medium ${distanceColor}
              `}
              >
                <span className="text-[11px]">📍</span>
                <span className="tracking-wide">{distanceLabel}</span>
              </div>
            )}

            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formatTime(createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
