import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import useJobFetcher from "../Hooks/useJobFetcher";
import { useSelector } from "react-redux";

interface Asset {
  id: number;
  jobId: number;
  fileName: string;
  fileType: string;
  filePosition: string;
}
interface Job {
  id: number;
  title: string;
  description: string;
  budget: number;
  categoryId: number;
  cityId: number;
  addressId: number;
  initialAddress: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  assets: Asset[];
}

interface Category {
  id: number;
  name: string;
  description: string;
}

interface ExploreProviderProps {
  children: ReactNode;
}

interface ExploreContextType {
  jobs: Job[];
  categories: Category[];
  jobsLoading: boolean;
  categoriesLoading: boolean;
  fetchMoreJobs: (offset: number) => Promise<void>;
  hasMore: boolean;
  fetchMyUploadedJob: (id: string) => Promise<void>;
}

const ExploreContext = createContext<ExploreContextType | undefined>(undefined);

export const ExploreProvider = ({ children }: ExploreProviderProps) => {
  const token = useSelector((s: any) => s.auth.token);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const { fetchJobByIdForPublic } = useJobFetcher();

  const fetchAllJobs = async (offset = 0) => {
    setJobsLoading(true);
    try {
      const res = await fetch(
        `${VITE_API_BASE_URL}/api/v1/jobs?offset=${offset}`,
        {
          // credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      // 🔹 Append if offset > 0, else replace
      if (offset > 0) {
        if (data?.data.length < 10) setHasMore(false);
        setJobs((prev) => [...prev, ...(data?.data || [])]);
      } else {
        setJobs(data?.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setJobsLoading(false);
    }
  };

  // 🔹 Function for refetching or infinite scroll
  const fetchMoreJobs = async (offset: number) => {
    await fetchAllJobs(offset);
  };

  const fetchMyUploadedJob = async (id: string) => {
    const job = await fetchJobByIdForPublic(id);
    setJobs((prev) => [job, ...prev]);
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/v1/categories`, {
        // credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCategories(data?.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobs(0);
    fetchCategories();
  }, []);

  return (
    <ExploreContext.Provider
      value={{
        jobs,
        jobsLoading,
        categoriesLoading,
        categories,
        fetchMoreJobs,
        hasMore,
        fetchMyUploadedJob,
      }}
    >
      {children}
    </ExploreContext.Provider>
  );
};

export const useExploreContext = () => {
  const context = useContext(ExploreContext);
  if (!context) {
    throw new Error("useExploreContext must be used within a ExploreProvider");
  }
  return context;
};
