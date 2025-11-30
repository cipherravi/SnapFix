import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../../app/store";
import { setConversations } from "../../features/conversation/conversationSlice";
import { useRefetchConversationsMutation } from "../../services/api/conversationApi";
import useImageFetcher from "../../utils/Hooks/useImageFetcher";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

/** -----------------------------
 *  SMALL PRESENTATIONAL COMPONENTS
 * ------------------------------*/

const Avatar = ({
  loading,
  url,
  hasProfile,
}: {
  loading: boolean;
  url?: string;
  hasProfile: boolean;
}) => {
  if (loading) {
    return (
      <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse shadow-inner" />
    );
  }
  return (
    <img
      src={url}
      className={`w-12 h-12 rounded-full object-cover shadow-sm ${
        hasProfile ? "" : "p-1"
      }`}
    />
  );
};

const ActionButton = ({
  children,
  onClick,
  color = "primary",
  disabled = false,
}: {
  children: any;
  onClick: () => void;
  color?: "primary" | "danger";
  disabled?: boolean;
}) => {
  const styles =
    color === "primary"
      ? "bg-[#0385C2] hover:bg-[#0274a9]"
      : "bg-[#da2424] hover:bg-[#c11f1f]";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-white px-4 py-2 rounded-lg inter-regular transition-all duration-150 shadow-sm ${styles} ${
        disabled ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};

/** --------------------------------------------------
 *                      MAIN CARD
 * --------------------------------------------------*/

const ApplicantCard = ({
  applicant,
  onReject,
  onAssign,
}: ApplicantCardProps) => {
  const token = useSelector((s: RootState) => s.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [refetchConversations] = useRefetchConversationsMutation();
  const { fetchProfileImage } = useImageFetcher();

  const [isAssigning, setIsAssigning] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [fullProfilePicUrl, setFullProfilePicUrl] = useState<string>();
  const [loadingProfilePic, setLoadingProfilePic] = useState(true);

  /** --------------------------------------------------
   *                   LOAD PROFILE IMAGE
   * --------------------------------------------------*/
  useEffect(() => {
    const load = async () => {
      if (!applicant.worker.profilePicUrl) {
        setFullProfilePicUrl("/svg/profile.svg");
        setLoadingProfilePic(false);
        return;
      }

      setLoadingProfilePic(true);
      const url = await fetchProfileImage(applicant.worker.profilePicUrl);

      setFullProfilePicUrl(url || "/svg/profile.svg");
      setLoadingProfilePic(false);
    };

    load();
  }, [applicant]);

  /** --------------------------------------------------
   *                        ACTIONS
   * --------------------------------------------------*/

  const assignHandler = async () => {
    setIsAssigning(true);
    try {
      const response = await fetch(
        `${VITE_API_BASE_URL}/api/v1/jobs/${applicant.jobId}/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: applicant.userId }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);

        onAssign((prev) =>
          prev
            ? prev.map((a) =>
                a.id === applicant.id ? { ...a, status: "selected" } : a
              )
            : prev
        );

        refetchConversations().then((res) => {
          if (res.data) dispatch(setConversations(res.data));
        });
      } else toast.error(data.message);
    } catch (error) {
      console.error("Assign error:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  const rejectHandler = async () => {
    try {
      const response = await fetch(
        `${VITE_API_BASE_URL}/api/v1/jobs/${applicant.jobId}/applicants/${applicant.id}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        onReject(applicant.id);
      } else toast.error(data.message);
    } catch (error) {
      console.error("Reject error:", error);
    }
  };

  const chatHandler = async () => {
    try {
      const response = await fetch(
        `${VITE_API_BASE_URL}/api/v1/conversations/by-job?jobId=${applicant.jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data?.data?.id) navigate(`/conversation/${data.data.id}`);
    } catch (err) {
      console.error("Chat fetch error:", err);
    }
  };

  /** --------------------------------------------------
   *                        UI
   * --------------------------------------------------*/

  return (
    <div className="flex gap-3 p-4 rounded-xl bg-white  shadow-sm hover:shadow-md transition-all">
      {/* Avatar */}
      <Avatar
        loading={loadingProfilePic}
        url={fullProfilePicUrl}
        hasProfile={!!applicant.worker.profilePicUrl}
      />

      {/* INFO */}
      <div className="flex-1 flex flex-col gap-1">
        <h1 className="text-lg inter-semibold">{applicant.worker.name}</h1>
        <p className="text-sm text-gray-600 capitalize">
          {applicant.worker.gender}
        </p>

        <p className="inter-medium text-sm mt-1">
          <span className="font-semibold">Status:</span> {applicant.status}
        </p>

        {applicant.message && (
          <div
            className={`text-sm text-gray-700 cursor-pointer transition-all duration-200 ${
              isExpanded ? "" : "line-clamp-2"
            }`}
            onClick={() => setIsExpanded((p) => !p)}
          >
            <strong>Message:</strong> {applicant.message}
            <span className="block text-xs text-blue-500 mt-1">
              {isExpanded ? "Show less" : "Show more"}
            </span>
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col justify-center gap-2 min-w-[90px]">
        {applicant.status === "selected" ? (
          <>
            <ActionButton onClick={chatHandler}>Chat</ActionButton>
            <ActionButton onClick={() => {}} color="danger">
              Cancel
            </ActionButton>
          </>
        ) : (
          <>
            <ActionButton onClick={assignHandler} disabled={isAssigning}>
              {isAssigning ? "Assigning…" : "Assign"}
            </ActionButton>

            <ActionButton onClick={rejectHandler} color="danger">
              Reject
            </ActionButton>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicantCard;
