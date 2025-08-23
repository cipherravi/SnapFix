import BackButton from "../../components/Buttons/BackButton";
import { useParams } from "react-router-dom";
import useJobFetcher from "../../utils/Hooks/useJobFetcher";
import { useEffect, useState } from "react";
import InfoSection from "../../components/postedJobDashboard/InfoSection";
import ApplicantsSection from "../../components/postedJobDashboard/ApplicantsSection";
import EditSection from "../../components/postedJobDashboard/EditSection";

interface Job {
  budget: number;
  categoryId: number;
  cityId: number;
  createdAt: string;
  description: string;
  id: number;
  status: string;
  title: string;
  updatedAt: string;
  userId: number;
  workerId: number;
  address: string;
  addressId: number;
  lat: string;
  lng: string;
  worker: {
    name: string;
    gender: string;
    profilePicUrl: string;
  };
}

// Define as const to get literal types
export const TabIndex = {
  INFO: 0,
  APPLICANTS: 1,
  EDIT: 2,
} as const;

// Define a union type of the values
type TabIndex = (typeof TabIndex)[keyof typeof TabIndex];
const PostedJobDashboard = () => {
  const { id } = useParams();
  const { fetchJobById } = useJobFetcher();
  const [jobDetails, setJobDetails] = useState<Job | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<TabIndex>(TabIndex.INFO);
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await fetchJobById(id);
        setJobDetails(data);
      }
    };
    fetchData();
  }, [id]);

  const isActive = (tab: TabIndex) =>
    activeTab === tab ? "bg-white text-black" : "bg-transparent text-white";

  const TabButtonStyle = "px-6 py-2 rounded-2xl text-lg inter-medium";
  return (
    <div className="w-full min-h-screen flex flex-col relative bg-[#fafafa]">
      <div className="shrink-0 pt-4 px-3 flex flex-col gap-4 absolute z-10">
        <BackButton navigateTo="/profile/jobs" />
      </div>
      {/* Banner */}
      <div className="w-full h-60 bg-[#b18686] flex items-center justify-center">
        <img
          src="/svg/profile.svg"
          alt="Poster"
          className="h-40 object-contain"
        />
      </div>
      {/* Tabs */}
      <div className="flex justify-between bg-[#282727] p-4 gap-2 text-white">
        <button
          className={`${TabButtonStyle} ${isActive(TabIndex.INFO)}`}
          onClick={() => setActiveTab(TabIndex.INFO)}
        >
          Info
        </button>
        <button
          className={`${TabButtonStyle} ${isActive(TabIndex.APPLICANTS)}`}
          onClick={() => setActiveTab(TabIndex.APPLICANTS)}
        >
          Applicants
        </button>
        <button
          className={`${TabButtonStyle} ${isActive(TabIndex.EDIT)}`}
          onClick={() => setActiveTab(TabIndex.EDIT)}
        >
          Edit
        </button>
      </div>
      {/* Dynamic  */}
      <div className="shrink w-full h-full">
        {activeTab === TabIndex.INFO && jobDetails && (
          <InfoSection {...jobDetails} />
        )}
        {activeTab === TabIndex.APPLICANTS && id && (
          <ApplicantsSection id={id} />
        )}
        {activeTab === TabIndex.EDIT && jobDetails && (
          <EditSection {...jobDetails} />
        )}
      </div>
    </div>
  );
};

export default PostedJobDashboard;
