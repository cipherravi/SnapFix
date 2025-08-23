import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Application {
  id: number;
  status: string;
  userId: number;
  jobId: number;
  createdAt: string;
  worker: {
    name: string;
    gender: string;
    profilePicUrl: string;
    city: {
      name: string;
      pincode: string;
      state: string;
    };
  };
}

interface ApplicantCardProps {
  applicant: Application;
  onReject: (id: number) => void;
}

const ApplicantCard = ({ applicant, onReject }: ApplicantCardProps) => {
  const navigate = useNavigate();

  const assignHandler = async () => {
    try {
      if (applicant?.id) {
        const response = await fetch(
          `${VITE_API_BASE_URL}/api/v1/jobs/${applicant.jobId}/accept`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: applicant.userId }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          toast.success(data?.message);
        } else {
          toast.error(data?.message);
        }
      }
    } catch (error) {
      console.error("Failed to assign", error);
    }
  };

  const rejectHandler = async () => {
    try {
      if (applicant?.id) {
        const response = await fetch(
          `${VITE_API_BASE_URL}/api/v1/jobs/${applicant.jobId}/applicants/${applicant.id}/reject`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
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
        `${VITE_API_BASE_URL}/api/v1/conversations/${applicant.jobId}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
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
        <p className="text-sm text-gray-500">
          {applicant.worker.city.name}, {applicant.worker.city.state} -{" "}
          {applicant.worker.city.pincode}
        </p>
        <p className="inter-light text-sm">Status: {applicant.status}</p>
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
            Assign
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
