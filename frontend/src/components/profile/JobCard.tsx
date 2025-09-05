import { useNavigate } from "react-router-dom";
import getStatusColor from "../../utils/common/getStatusColor";

type jobCardProps = {
  id: number;
  title: string;
  description: string;
  status: string;
  budget: number;
  worker?: {
    id: number;
    name: string;
    phone?: string;
    profilePicUrl?: string;
  };
};

const JobCard = ({
  id,
  title,
  description,
  status,
  budget,
  worker,
}: jobCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="w-full h-32 rounded-2xl py-3 bg-[#454545] text-white flex flex-col gap-2 "
      onClick={() => navigate(`${id}`)}
    >
      {/* First */}
      <div className="flex justify-between items-center gap-2 px-4">
        <p className="inter-medium truncate w-[60%]">{title}</p>
        <p className="text-nowrap">
          Status : <b className={getStatusColor(status)}>{status}</b>
        </p>
      </div>
      {/* Second */}
      <div className="flex justify-between items-center gap-2 px-4">
        <p className="inter-light truncate w-[60%] text-sm">
          {description || "No description"}
        </p>
        <p className="text-nowrap">
          {worker?.name ? (
            <b className="inter-light text-sm">
              Assigned to:{" "}
              <b className="inter-medium text-[#f6ff00]">{worker.name}</b>
            </b>
          ) : (
            <b className="text-white text-sm inter-medium">Not assigned</b>
          )}
        </p>
      </div>
      {/* Third */}
      <div className="flex justify-between items-center gap-2 px-4">
        <p className="inter-medium">
          Budget : <b className="inter-medium text-green-400">{budget}</b>
        </p>
        {status === "approved" && (
          <button
            className="bg-[#0385C2] px-2 py-1 rounded-xl text-white"
            onClick={(e) => {
              e.stopPropagation(); // prevent navigation
            }}
          >
            Approve
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
