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
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {/* Banner Image */}
      <div className="h-40 w-full bg-gray-200">
        {url ? (
          <img
            src={url}
            alt={`Job image for ${title}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm bg-white">
            No Image Available
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {title}
        </h2>
        <p className="text-sm text-gray-600 truncate">
          {description || "No description provided."}
        </p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-base font-bold text-green-700">₹ {budget}</span>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {formatTime(createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
