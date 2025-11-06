import { useNavigate } from "react-router-dom";
import getStatusColor from "../../utils/common/getStatusColor";
import UpdateStatusModal from "../modals/UpdateStatusModal";
import toast from "react-hot-toast";
import { useState } from "react";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  const [showModal, setShowModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [submitting, setSubmitting] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/v1/jobs/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.ok) {
        setCurrentStatus(newStatus);
      } else {
        toast.error(data.message);
      }

      // Wait for animation to complete before closing
      setTimeout(() => {
        setShowModal(false);
        setSubmitting(false);
      }, 800); // match the animation duration
    } catch (err) {
      console.error("Failed to update status:", err);
      setSubmitting(false);
    }
  };

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
          Budget : <b className="inter-medium text-green-500">₹{budget}</b>
        </p>
        {status === "initiated" ? (
          <button
            className="bg-[#0385C2] px-8 py-1 rounded-xl text-white"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/payments/${id}`);
            }}
          >
            Pay
          </button>
        ) : (
          status === "completed" && (
            <button
              className="px-4 py-2 bg-[#0385C2] rounded-md text-white text-sm font-semibold hover:bg-[#0271a4] transition"
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
            >
              Approve
            </button>
          )
        )}
        {
          <UpdateStatusModal
            isOpen={showModal}
            isSubmitting={submitting}
            currentStatus={currentStatus}
            onCancel={() => setShowModal(false)}
            onConfirm={handleStatusUpdate}
          />
        }
      </div>
    </div>
  );
};

export default JobCard;
