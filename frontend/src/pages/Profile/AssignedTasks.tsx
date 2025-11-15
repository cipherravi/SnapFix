import { useEffect, useState } from "react";
import BackButton from "../../components/Buttons/BackButton";
import useTaskFetcher from "../../utils/Hooks/useTaskFetcher";
import TaskCard from "../../components/profile/TaskCard";

type PaymentMethod = "cod" | "online";
interface Payment {
  id: number;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: string;
}
interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  budget: number;
  userId: number;
  workerId: number;
  categoryId: number;
  cityId: number;
  addressId: number;
  initialAddress: string;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
  activePayment: Payment;
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
    "bg-[#0385C2] text-white px-4 py-1 rounded-full text-sm sm:text-base whitespace-nowrap transition hover:bg-[#0271a4]";

  return (
    <div className="w-full h-full flex flex-col justify-center overflow-hidden bg-white">
      {/* Header */}
      <div className="shrink-0 pt-4 px-4 sm:px-6 flex flex-col gap-4">
        <BackButton navigateTo="/profile" />
        <h1 className="text-2xl sm:text-3xl poppins-bold text-gray-800">
          Tasks
        </h1>

        {/* Filter Buttons */}
        <div className="w-full flex justify-start gap-2  overflow-x-auto hide-scrollbar">
          <button className={buttonStyleClass}>All</button>
          <button className={buttonStyleClass}>Active</button>
          <button className={buttonStyleClass}>Completed</button>
          <button className={buttonStyleClass}>Failed</button>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 pt-10">
        <div className="w-full max-w-screen-sm md:max-w-3xl lg:max-w-5xl mx-auto space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.description}
                budget={task.budget}
                status={task.status}
                createdAt={task.createdAt}
                workerId={task.workerId}
                payment={task.activePayment}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-24">No Tasks Found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignedTasks;
