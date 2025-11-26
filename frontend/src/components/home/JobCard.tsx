import { formatTime } from "../../utils/formatTime";
import { useNavigate } from "react-router-dom";
import useImageFetcher from "../../utils/Hooks/useImageFetcher";

interface JobCardProps {
  id: number;
  src?: string;
  title: string;
  description: string;
  budget: number;
  createdAt: string;
}

const JobCard = ({
  id,
  src,
  title,
  description,
  budget,
  createdAt,
}: JobCardProps) => {
  const navigate = useNavigate();
  const { getImageUrl } = useImageFetcher();
  const url = getImageUrl(src, "jobAssets");

  const handleClick = () => {
    navigate(`/jobs/${id}/${title.split(" ").join("-")}`);
  };

  return (
    <div
      className="
        bg-white rounded-2xl shadow-sm 
        overflow-hidden cursor-pointer 
        transition hover:shadow-md 
        focus:outline-none focus:ring-2 focus:ring-blue-400
      "
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

        <div className="flex justify-between items-center pt-1">
          <span className="text-base font-bold text-green-700">₹ {budget}</span>

          <span className="text-xs text-gray-500 whitespace-nowrap">
            {formatTime(createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
