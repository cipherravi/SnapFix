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

  return (
    <div className="w-full min-h-screen flex flex-col bg-white px-4 sm:px-6 md:px-10 py-6">
      {/* Header */}
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-2">
        <BackButton navigateTo="/profile" />
        <h1 className="text-2xl sm:text-3xl poppins-bold">Tasks</h1>
        <p className="text-gray-600 text-sm sm:text-base mb-4">
          Manage your tasks and track their progress easily
        </p>
      </div>

      {/* Filters */}
      <div className="w-full max-w-3xl mx-auto flex gap-2 overflow-x-auto hide-scrollbar mb-4">
        <button className="bg-[#0385C2] text-white px-4 py-1 rounded-2xl inter-medium">
          All
        </button>
        <button className="bg-[#515252] text-white px-4 py-1 rounded-2xl inter-medium">
          Active
        </button>
        <button className="bg-[#515252] text-white px-4 py-1 rounded-2xl inter-medium">
          Completed
        </button>
        <button className="bg-[#515252] text-white px-4 py-1 rounded-2xl inter-medium">
          Failed
        </button>
      </div>

      {/* Task Cards List */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
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
