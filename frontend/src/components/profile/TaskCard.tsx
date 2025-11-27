import { formatTime } from "../../utils/formatTime";
import getStatusColor from "../../utils/common/getStatusColor";
import { useNavigate } from "react-router-dom";
import UpdateStatusModal from "../modals/UpdateStatusModal";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import { useUserInfo } from "../../utils/context/UserInfoContext";
import { useSelector } from "react-redux";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type PaymentMethod = "cod" | "online" | "wallet";
interface Payment {
  id: number;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: string;
}
interface TaskCardProps {
  id: number;
  title: string;
  description: string;
  status: string;
  budget: number;
  workerId: number;
  createdAt: string;
  payment: Payment;
}

const TaskCard = ({
  id,
  title,
  description,
  status,
  budget,
  workerId,
  createdAt,
  payment,
}: TaskCardProps) => {
  const token = useSelector((s: any) => s.auth.token);

  const navigate = useNavigate();
  // const { userData } = useUserInfo();
  const userData = useSelector((store: any) => store.user.userData);

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
        // credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
      onClick={() => navigate(`${id}`)}
      className="
      w-full rounded-2xl p-5
      bg-white/80 backdrop-blur-xl 
      border border-gray-200
      shadow-[0_4px_20px_rgba(0,0,0,0.06)]
      hover:shadow-[0_6px_26px_rgba(0,0,0,0.10)]
      hover:scale-[1.01]
      transition-all cursor-pointer
      flex flex-col justify-between gap-5
      relative
    "
    >
      {/* STATUS BADGE */}
      <span
        className={`
        absolute top-4 right-4 text-xs px-3 py-1.5 rounded-full
        font-semibold tracking-wide shadow-sm backdrop-blur
        ${getStatusColor(currentStatus)}
      `}
      >
        {currentStatus}
      </span>

      {/* LEFT SIDE */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Title */}
        <h2 className="w-2/3 text-lg sm:text-xl font-semibold text-gray-900 leading-snug truncate">
          {title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {description || "No description provided."}
        </p>

        {/* Info */}
        <div className="flex flex-wrap items-center gap-5 text-sm pt-1">
          <p>
            <span className="text-gray-500">Budget:</span>{" "}
            <span className="text-green-600 font-semibold">₹{budget}</span>
          </p>

          <p>
            <span className="text-gray-500">Applied:</span>{" "}
            <span className="font-medium">{formatTime(createdAt)}</span>
          </p>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="flex justify-between items-center mt-4 w-full">
        {/* Payment Badge */}
        {payment && (
          <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-100">
            {payment.method === "cod" ? "Cash on Delivery" : "Online Payment"}
          </span>
        )}

        {/* Update Button */}
        {currentStatus !== "approved" && (
          <button
            className="
            px-5 py-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 
            text-white text-sm font-semibold shadow-sm
            hover:opacity-90 active:scale-95 transition
          "
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
          >
            Update
          </button>
        )}
      </div>

      <UpdateStatusModal
        jobId={id}
        isOpen={showModal}
        isSubmitting={submitting}
        currentStatus={currentStatus}
        onCancel={() => setShowModal(false)}
        onConfirm={handleStatusUpdate}
        isWorker={isWorker}
        payment={payment}
      />
    </div>
  );
};

export default TaskCard;
