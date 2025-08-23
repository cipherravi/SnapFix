import { useNavigate } from "react-router-dom";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "text-amber-500";
      case "started":
        return "text-sky-500";
      case "completed":
        return "text-emerald-500";
      case "approved":
        return "text-[#24b9ff]";
      case "cancelled":
        return "text-rose-500";
      default:
        return "text-slate-400";
    }
  };

  return (
    <div
      className="w-full h-32 rounded-2xl py-3 bg-[#454545] text-white flex flex-col gap-2"
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
        <p className="inter-light truncate w-[60%] text-sm">{description}</p>
        <p className="text-nowrap">
          {worker?.name ? (
            <b className="inter-light text-sm">
              Assigned to:{" "}
              <b className="inter-medium text-lime-400">{worker.name}</b>
            </b>
          ) : (
            <b className="text-pink-100 inter-medium">Not assigned</b>
          )}
        </p>
      </div>
      {/* Third */}
      <div className="flex justify-between items-center gap-2 px-4">
        <p className="inter-medium">
          Budget : <b className="inter-medium text-amber-400">{budget}</b>
        </p>
        {status === "completed" && (
          <button className="bg-[#0385C2] px-2 py-1 rounded-xl text-white">
            Approve
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
