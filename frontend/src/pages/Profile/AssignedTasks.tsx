import { useEffect, useState, useMemo } from "react";
import BackButton from "../../components/Buttons/BackButton";
import TaskCard from "../../components/profile/TaskCard";
import JobsRefetchShimmer from "../../components/shimmer/JobsRefetchShimmer";
import { useFetchMyTasksQuery } from "../../services/api/jobApi";

type PaymentMethod = "cod" | "online" | "wallet";

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

const TASK_STATUS = {
  INITIATED: "initiated",
  POSTED: "posted",
  ASSIGNED: "assigned",
  STARTED: "started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  APPROVED: "approved",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
} as const;

type FilterType = "all" | "active" | "completed" | "failed";

const AssignedTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // default = active
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("active");

  const { data: fetchedTasks, isLoading } = useFetchMyTasksQuery(undefined);

  useEffect(() => {
    if (!fetchedTasks) return;
    setTasks(fetchedTasks);
  }, [fetchedTasks]);

  // ---------------------------
  // FILTER LOGIC (same as jobs)
  // ---------------------------
  const filteredTasks = useMemo(() => {
    switch (selectedFilter) {
      case "all":
        return tasks;

      case "active":
        return tasks.filter(
          (task) =>
            ![
              TASK_STATUS.APPROVED,
              TASK_STATUS.CANCELLED,
              TASK_STATUS.EXPIRED,
            ].includes(
              task.status as
                | typeof TASK_STATUS.APPROVED
                | typeof TASK_STATUS.CANCELLED
                | typeof TASK_STATUS.EXPIRED
            )
        );

      case "completed":
        return tasks.filter((task) => task.status === TASK_STATUS.APPROVED);

      case "failed":
        return tasks.filter((task) =>
          [TASK_STATUS.CANCELLED, TASK_STATUS.EXPIRED].includes(
            task.status as
              | typeof TASK_STATUS.CANCELLED
              | typeof TASK_STATUS.EXPIRED
          )
        );

      default:
        return tasks;
    }
  }, [tasks, selectedFilter]);

  // Filter button config
  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "failed", label: "Failed" },
  ];

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
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedFilter(key)}
            className={`px-4 py-1 rounded-2xl inter-medium transition-all
              ${
                selectedFilter === key
                  ? "bg-[#0385C2] text-white"
                  : "bg-[#515252] text-white"
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Task Cards */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
          {isLoading ? (
            <JobsRefetchShimmer />
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
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
