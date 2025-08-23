import { useEffect, useState } from "react";
import useApplicantsFetcher from "../../utils/Hooks/useApplicantsFetcher";
import ApplicantCard from "./ApplicantCard";

interface ApplicantsSectionProps {
  id: number | string;
}

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

const ApplicantsSection = ({ id }: ApplicantsSectionProps) => {
  const fetchApplicants = useApplicantsFetcher();
  const [applicants, setApplicants] = useState<Application[] | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const fetchedApplicants = await fetchApplicants(id);

        setApplicants(fetchedApplicants);
      }
    };
    fetchData();
  }, [id]);

  const removeApplicant = (applicantId: number) => {
    setApplicants((prev) =>
      prev?.filter((applicant) => applicant.id !== applicantId)
    );
  };

  return (
    <div className="w-full h-full flex flex-col p-4">
      {/* Card */}
      {applicants && applicants.length > 0 ? (
        <div className="flex flex-col gap-4">
          {applicants
            .filter((applicant) => applicant.status !== "rejected")
            .map((applicant) => (
              <ApplicantCard
                key={applicant.id}
                applicant={applicant}
                onReject={removeApplicant}
              />
            ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-24">No applicants found.</p>
      )}
    </div>
  );
};

export default ApplicantsSection;
