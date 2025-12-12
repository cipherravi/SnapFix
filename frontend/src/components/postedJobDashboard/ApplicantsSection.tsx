import { useEffect, useState } from "react";
import useApplicantsFetcher from "../../utils/Hooks/useApplicantsFetcher";
import ApplicantCard from "./ApplicantCard";
import ApplicantsShimmer from "../shimmer/ApplicantShimmer";

interface ApplicantsSectionProps {
  id: number | string;
}

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

const ApplicantsSection = ({ id }: ApplicantsSectionProps) => {
  const fetchApplicants = useApplicantsFetcher();
  const [applicants, setApplicants] = useState<Application[] | undefined>();

  useEffect(() => {
    const load = async () => {
      if (!id) return;

      const fetched = await fetchApplicants(id);
      setApplicants(fetched);
    };

    load();
  }, [id]);

  const removeApplicant = (applicantId: number) => {
    setApplicants((prev) =>
      prev?.filter((applicant) => applicant.id !== applicantId)
    );
  };

  const nonRejected = applicants?.filter(
    (applicant) => applicant.status !== "rejected"
  );

  return (
    <div className="w-full h-full flex flex-col ">
      {/* Section Title */}
      <h2 className="text-2xl inter-semibold mb-3 text-gray-800">Applicants</h2>
      {/* ⬅️ SHOW SHIMMER UNTIL DATA LOADED */}
      {applicants === undefined && <ApplicantsShimmer />}

      {/* If loaded but empty */}
      {applicants !== undefined &&
        (!nonRejected || nonRejected.length === 0) && (
          <div className="flex flex-col items-center justify-center mt-10 text-center">
            <img src="/svg/empty.svg" alt="Empty" className="w-36 opacity-70" />
            <p className="text-gray-500 mt-3 text-lg font-semibold">
              No applicants yet.
            </p>
            <p className="text-gray-400 text-sm">
              When workers apply to your job, they will appear here.
            </p>
          </div>
        )}

      {/* If applicants available */}
      {nonRejected && nonRejected.length > 0 && (
        <div className="flex flex-col gap-4">
          {nonRejected.map((applicant) => (
            <div
              key={applicant.id}
              className="
                bg-white rounded-xl shadow-sm 
                hover:shadow-md 
                transition-all duration-200 
              "
            >
              <ApplicantCard
                applicant={applicant}
                onReject={removeApplicant}
                onAssign={setApplicants}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicantsSection;
