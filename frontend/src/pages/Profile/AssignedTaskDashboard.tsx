import { useParams } from "react-router-dom";
import BackButton from "../../components/Buttons/BackButton";
import InfoSection from "../../components/postedJobDashboard/InfoSection";
import useJobFetcher from "../../utils/Hooks/useJobFetcher";
import { useEffect, useState } from "react";
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

const AssignedTaskDashboard = () => {
  const { id } = useParams();
  const { fetchJobById } = useJobFetcher();
  const [taskDetails, setTaskDetails] = useState<Job | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await fetchJobById(id);
        setTaskDetails(data);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="w-full min-h-screen flex flex-col relative bg-[#fafafa]">
      <div className="shrink-0 pt-4 px-3 flex flex-col gap-4 absolute z-10">
        <BackButton navigateTo="/profile/tasks" />
      </div>
      {/* Banner */}
      <div className="w-full h-60 bg-[#b18686] flex items-center justify-center">
        <img
          src="/svg/profile.svg"
          alt="Poster"
          className="h-40 object-contain"
        />
      </div>

      {/* Dynamic  */}
      {taskDetails && <InfoSection {...taskDetails} />}
    </div>
  );
};

export default AssignedTaskDashboard;
