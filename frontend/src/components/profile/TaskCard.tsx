import { formatTime } from "../../utils/formatTime";
import getStatusColor from "../../utils/common/getStatusColor";
import { useNavigate } from "react-router-dom";
import UpdateStatusModal from "../modals/UpdateStatusModal";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useUserInfo } from "@/utils/context/UserInfoContext";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface TaskCardProps {
  id: number;
  title: string;
  description: string;
  status: string;
  budget: number;
  workerId: number;
  createdAt: string;
}

const TaskCard = ({
  id,
  title,
  description,
  status,
  budget,
  workerId,
  createdAt,
}: TaskCardProps) => {
  const navigate = useNavigate();
  const { userData } = useUserInfo();

  const [showModal, setShowModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [submitting, setSubmitting] = useState(false);
  const [isWorker, setIsWorker] = useState(false);

  useEffect(() => {
    if (userData?.id == workerId) {
      setIsWorker(true);
    }
  }, []);

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
      setShowModal(false);
    }
  };

  return (
    <div
      className="w-full bg-[#454545] text-white rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between gap-4 hover:shadow-lg transition cursor-pointer"
      onClick={() => navigate(`${id}`)}
    >
      {/* Left Section */}
      <div className="flex-1 flex flex-col gap-2">
        <h1 className="text-lg sm:text-xl font-semibold line-clamp-1">
          {title}
        </h1>
        <p className="text-sm text-gray-200 line-clamp-2">{description}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <p>
            <span className="text-gray-300">Budget:</span>{" "}
            <span className="text-green-400 font-semibold">₹{budget}</span>
          </p>
          <p>
            <span className="text-gray-300">Applied on:</span>{" "}
            <span className="font-medium">{formatTime(createdAt)}</span>
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex sm:flex-col justify-between sm:items-end gap-3 sm:gap-4">
        <p className="text-sm whitespace-nowrap">
          Status:{" "}
          <span className={`font-semibold ${getStatusColor(currentStatus)}`}>
            {currentStatus}
          </span>
        </p>

        {currentStatus !== "approved" && (
          <button
            className="px-4 py-2 bg-[#0385C2] rounded-md text-white text-sm font-semibold hover:bg-[#0271a4] transition"
            onClick={(e) => {
              e.stopPropagation(); // prevent navigation
              setShowModal(true);
            }}
          >
            Update
          </button>
        )}
        {
          <UpdateStatusModal
            isOpen={showModal}
            isSubmitting={submitting}
            currentStatus={currentStatus}
            onCancel={() => setShowModal(false)}
            onConfirm={handleStatusUpdate}
            isWorker={isWorker}
          />
        }
      </div>
    </div>
  );
};

export default TaskCard;
