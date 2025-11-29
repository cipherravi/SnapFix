import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector, useDispatch } from "react-redux";
import { setConversations } from "../../features/conversation/conversationSlice";
import { useRefetchConversationsMutation } from "../../services/api/conversationApi";

import { RootState } from "../../app/store";

interface Application {
  id: number;
  status: string;
  userId: number;
  jobId: number;
  createdAt: string;
  message: string;
  worker: {
    name: string;
    gender: string;
    profilePicUrl: string;
  };
}

interface ApplicantCardProps {
  applicant: Application;
  onReject: (id: number) => void;
  onAssign: React.Dispatch<React.SetStateAction<Application[] | undefined>>;
}

const ApplicantCard = ({
  applicant,
  onReject,
  onAssign,
}: ApplicantCardProps) => {
  const token = useSelector((s: RootState) => s.auth.token);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const conversations = useSelector(
    (s: RootState) => s.conversation.conversations
  );

  const [refetchConversations] = useRefetchConversationsMutation();

  const [isAssigning, setIsAssigning] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const assignHandler = async () => {
    setIsAssigning(true);
    try {
      if (applicant?.id) {
        const response = await fetch(
          `${VITE_API_BASE_URL}/api/v1/jobs/${applicant.jobId}/accept`,
          {
            method: "POST",
            // credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId: applicant.userId }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          toast.success(data?.message);
          onAssign((prev) =>
            prev
              ? prev.map((a) =>
                  a.id === applicant.id ? { ...a, status: "selected" } : a
                )
              : prev
          );
          // refresh conversations
          refetchConversations().then((res) => {
            if (res.data) {
              dispatch(setConversations(res.data));
            }
          });
        } else {
          toast.error(data?.message);
        }
      }
    } catch (error) {
      console.error("Failed to assign", error);
    } finally {
      setIsAssigning(false);
    }
  };

  const rejectHandler = async () => {
    try {
      if (applicant?.id) {
        const response = await fetch(
          `${VITE_API_BASE_URL}/api/v1/jobs/${applicant.jobId}/applicants/${applicant.id}/reject`,
          {
            method: "POST",
            // credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          toast.success(data?.message);
          onReject(applicant.id);
        } else {
          toast.error(data?.message);
        }
      }
    } catch (error) {
      console.error("Failed to assign", error);
    }
  };

  const chatHandler = async () => {
    try {
      const response = await fetch(
        `${VITE_API_BASE_URL}/api/v1/conversations/by-job?jobId=${applicant.jobId}`,
        {
          // credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      if (data?.data?.id) navigate(`/conversation/${data.data.id}`);
    } catch (error) {
      console.error("Failed to fetch conversation Id", error);
    }
  };
  return (
    <div className="flex justify-between items-center border px-3 py-4 gap-2 rounded-lg bg-[#f0f0f0]">
      {/* Avatar */}
      {applicant.worker.profilePicUrl && (
        <img
          src={applicant.worker.profilePicUrl}
          alt="Applicant profile pic"
          className="w-14 h-14 object-cover p-1 border rounded-full"
        />
      )}

      {/* Info */}
      <div className="flex-1">
        <h1 className="text-lg inter-semibold">{applicant.worker.name}</h1>
        <p className="text-sm text-gray-600 capitalize">
          {applicant.worker.gender}
        </p>
        <p className="inter-medium text-sm">Status: {applicant.status}</p>
        {applicant.message && (
          <div
            className={`inter-light text-sm max-w-[90%] cursor-pointer transition-all duration-300 ${
              isExpanded ? "" : "line-clamp-2"
            }`}
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            <strong>Message:</strong> {applicant.message}
            <span className="block text-xs text-blue-600">
              {isExpanded ? "Show less" : "Show more"}
            </span>
          </div>
        )}
      </div>
      {/* Buttons */}
      {applicant.status == "selected" ? (
        <div className="flex flex-col gap-3">
          <button
            className="bg-[#0385C2] text-white py-2 rounded-lg inter-regular"
            onClick={chatHandler}
          >
            Chat
          </button>
          <button className="bg-[#da2424] text-white px-3 py-2 rounded-lg inter-regular">
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex flex-col justify-between gap-3">
          <button
            className="bg-[#0385C2] text-white px-3 py-2 rounded-lg inter-regular"
            onClick={assignHandler}
          >
            {isAssigning ? "Assigning" : "Assign"}
          </button>
          <button
            className="bg-[#da2424] text-white px-3 py-2 rounded-lg inter-regular"
            onClick={rejectHandler}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicantCard;
