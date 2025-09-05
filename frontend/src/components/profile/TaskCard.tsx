import { formatTime } from "../../utils/formatTime";
import getStatusColor from "../../utils/common/getStatusColor";
import { useNavigate } from "react-router-dom";

interface TaskCardProps {
  id: number;
  title: string;
  description: string;
  status: "assigned";
  budget: number;
  createdAt: string;
}

const TaskCard = ({
  id,
  title,
  description,
  status,
  budget,
  createdAt,
}: TaskCardProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="w-full h-40 rounded-2xl py-3 px-4 bg-[#454545] text-white flex  gap-2 "
      onClick={() => navigate(`${id}`)}
    >
      {/* Left */}
      <div className="w-2/3 shrink flex flex-col gap-2">
        <h1 className="inter-semibold text-xl ">{title}</h1>
        <p className="inter-light text-sm truncate">{description}</p>
        <p>
          Budget:{" "}
          <strong className="text-green-400 inter-bold">{budget}</strong>
        </p>
        <p>
          Applied on:{" "}
          <strong className="text-sm">{formatTime(createdAt)}</strong>
        </p>
      </div>
      {/* Right */}
      <div className="w-1/3 shrink-0 flex flex-col justify-around">
        <p className="text-nowrap text-sm ">
          Status: <strong className={getStatusColor(status)}>{status}</strong>
        </p>
        {status == "assigned" && (
          <button
            className="p-2 rounded-lg bg-[#0385C2] inter-bold"
            onClick={(e) => {
              e.stopPropagation(); // prevent navigation
              //do something
            }}
          >
            Update
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
