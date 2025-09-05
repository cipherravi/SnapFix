import { useEffect, useState } from "react";
import BackButton from "../../components/Buttons/BackButton";
import useTaskFetcher from "../../utils/Hooks/useTaskFetcher";
import TaskCard from "../../components/profile/TaskCard";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "assigned";
  budget: number;
  userId: number;
  workerId: number;
  categoryId: number;
  cityId: number;
  addressId: number;
  address: string;
  lat: string;
  lng: string;
  createdAt: string;
  updatedAt: string;
}

const AssignedTasks = () => {
  const { fetchMyTasks } = useTaskFetcher();

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedTasks = await fetchMyTasks();
      setTasks(fetchedTasks);
    };
    fetchData();
  }, []);

  const buttonStyleClass =
    "bg-[#0385C2] text-white px-4 py-1 rounded-2xl inter-medium";
  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white">
      {/* Header + Filter */}

      <div className="shrink-0 pt-4 px-3 flex flex-col gap-4">
        <BackButton navigateTo="/profile" />
        <h1 className="text-3xl poppins-bold">Tasks</h1>

        <div className="w-full flex justify-around gap-2">
          <button className={buttonStyleClass}>All</button>
          <button className={buttonStyleClass}>Active</button>
          <button className={buttonStyleClass}>Completed</button>
          <button className={buttonStyleClass}>Failed</button>
        </div>
      </div>

      {/* Cards */}

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 pt-10">
        {tasks.length > 0 ? (
          tasks.map((task) => {
            return (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                budget={task.budget}
                status={task.status}
                createdAt={task.createdAt}
              />
            );
          })
        ) : (
          <p>No Tasks Found</p>
        )}
      </div>
    </div>
  );
};

export default AssignedTasks;
