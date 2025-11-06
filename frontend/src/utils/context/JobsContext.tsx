import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import useTaskFetcher from "../Hooks/useTaskFetcher";
import useJobFetcher from "../Hooks/useJobFetcher";

import { type Job } from "@types";
interface JobsContextType {
  tasks: Job[];
  jobs: Job[];
}
interface JobsContextProvider {
  children: ReactNode;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

const JobsProvider = ({ children }: JobsContextProvider) => {
  const [jobs, setJobs] = useState<Job[] | []>([]);
  const [tasks, setTasks] = useState<Job[] | []>([]);

  const { fetchMyTasks } = useTaskFetcher();
  const { fetchMyJobs } = useJobFetcher();

  async function loadTasks() {
    const fetchedTasks = await fetchMyTasks();
    setTasks(fetchedTasks);
  }
  async function loadJobs() {
    const fetchedJobs = await fetchMyJobs();
    setJobs(fetchedJobs);
  }

  useEffect(() => {
    loadJobs();
    loadTasks();
  }, []);

  return (
    <JobsContext.Provider value={{ tasks, jobs }}>
      {children}
    </JobsContext.Provider>
  );
};

export default JobsProvider;

export const useJobsContext = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error(
      "useJobsContext must be used within an JobsContextProvider"
    );
  }
  return context;
};
