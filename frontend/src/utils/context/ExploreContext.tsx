// context/ExploreContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  latitude: string;
  longitude: string;
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
}

const ExploreContext = createContext<ExploreContextType | undefined>(undefined);

export const ExploreProvider = ({ children }: ExploreProviderProps) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const fetchAllJobs = async () => {
    setJobsLoading(true);
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/v1/jobs`, {
        credentials: "include",
      });
      const data = await res.json();

      setJobs(data?.data || []);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/v1/categories`, {
        credentials: "include",
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
    fetchAllJobs();
    fetchCategories();
  }, []);

  return (
    <ExploreContext.Provider
      value={{ jobs, jobsLoading, categoriesLoading, categories }}
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
