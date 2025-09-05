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

  return (
    <div
      className="bg-[#ececea] rounded-2xl p-2 max-h-80 overflow-hidden"
      onClick={() => navigate(`/job/${id}/${title.split(" ").join("-")}`)}
    >
      <img
        src={url}
        alt="Job Poster Image"
        className="w-full min-h-3/5 max-h-2/3 object-cover p-2 rounded-2xl overflow-hidden bg-white"
      />

      <h1 className="inter-semibold text-lg truncate">{title}</h1>
      <p className="w-full inter-light truncate text-light">{description}</p>
      <p className="inter-bold">₹ {budget}</p>
      <p className="inter-medium text-sm text-nowrap">
        Posted at : {formatTime(createdAt)}
      </p>
    </div>
  );
};

export default JobCard;
