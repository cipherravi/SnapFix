import { useNavigate } from "react-router-dom";
import getStatusColor from "../../utils/common/getStatusColor";
import UpdateStatusModal from "../modals/UpdateStatusModal";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from "react-redux";

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
  const token = useSelector((s: any) => s.auth.token);

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null);
  const displayStatus = optimisticStatus ?? status;

  const [submitting, setSubmitting] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    setSubmitting(true);
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/v1/jobs/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (res.ok) {
        setOptimisticStatus(newStatus);
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

  useEffect(() => {
    if (optimisticStatus && optimisticStatus === status) {
      setOptimisticStatus(null);
    }
  }, [status, optimisticStatus]);

  return (
    <div
      onClick={() => navigate(`${id}`)}
      className="
      relative w-full rounded-2xl p-5 
      bg-white/80 backdrop-blur-xl 
      border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.06)]
      hover:shadow-[0_6px_26px_rgba(0,0,0,0.10)]
      hover:scale-[1.01]
      transition-all cursor-pointer
      flex flex-col gap-4
    "
    >
      {/* STATUS BADGE */}
      <span
        className={`
        absolute top-4 right-4 text-xs px-3 py-1.5 rounded-full
        font-semibold tracking-wide shadow-sm backdrop-blur
        ${getStatusColor(displayStatus)}
      `}
      >
        {displayStatus}
      </span>

      {/* TITLE */}
      <h2 className="text-lg font-semibold text-gray-900 pr-16 leading-snug">
        {title}
      </h2>

      {/* DESCRIPTION */}
      <p className="text-gray-600 text-sm line-clamp-2">
        {description || "No description"}
      </p>

      {/* WORKER */}
      <div className="flex items-center justify-between">
        {worker?.name ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {worker.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs text-gray-500">Assigned to</span>
              <span className="text-sm font-semibold text-gray-900">
                {worker.name}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-sm text-gray-500 italic">Not assigned</span>
        )}

        {/* BUDGET */}
        <p className="font-semibold text-gray-900 text-sm">
          <span className="text-gray-500 font-normal">Budget:</span>{" "}
          <span className="text-green-600">₹{budget}</span>
        </p>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end mt-2">
        {displayStatus === "initiated" ? (
          <button
            className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold
                     hover:bg-blue-700 active:scale-95 transition"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/payments/${id}`);
            }}
          >
            Pay Now
          </button>
        ) : (
          displayStatus === "completed" && (
            <button
              className="px-6 py-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 
                       text-white text-sm font-bold shadow-sm
                       hover:opacity-90 active:scale-95 transition"
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
            >
              Approve Work
            </button>
          )
        )}

        <UpdateStatusModal
          isOpen={showModal}
          isSubmitting={submitting}
          currentStatus={displayStatus}
          onCancel={() => setShowModal(false)}
          onConfirm={handleStatusUpdate}
        />
      </div>
    </div>
  );
};

export default JobCard;
