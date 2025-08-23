import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ 1. Define the shape of your user data
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  profilePicUrl: string;
  role: string;
  cityId: number;
  createdAt: string;
  updatedAt: string;
  // Add more fields as per your backend response
}

// ✅ 2. Define the context type
interface UserInfoContextType {
  fetchProfile: () => Promise<void>;
  userData: User | null;
  userCoords: [number, number] | null;
  isLoading: boolean;
}

// ✅ 3. Create the context with correct type (undefined initially)
const UserInfoContext = createContext<UserInfoContextType | undefined>(
  undefined
);

// ✅ 4. Props for the provider
interface UserInfoProviderProps {
  children: ReactNode;
}

const UserInfoProvider = ({ children }: UserInfoProviderProps) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/v1/users/me`, {
        method: "GET",
        credentials: "include", // Send cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      // If user is not logged in (401), just skip
      if (res.status === 401 || res.status === 400) {
        setUserData(null);
        return;
      }

      if (!res.ok) {
        throw new Error(`Unexpected error: ${res.status}`);
      }

      const data = await res.json();
      setUserData(data?.data);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error fetching profile:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setUserCoords([position.coords.latitude, position.coords.longitude]);
  //       },
  //       (error) => {
  //         console.error("Failed to fetch coordinates", error);
  //       },
  //       {
  //         enableHighAccuracy: true,
  //         timeout: 10000,
  //         maximumAge: 0,
  //       }
  //     );
  //   }
  // }, []);

  useEffect(() => {
    fetchProfile();
  }, []);
  return (
    <UserInfoContext.Provider
      value={{
        fetchProfile,
        userData,
        isLoading,
        userCoords,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;

// ✅ 5. Safe custom hook
export const useUserInfo = () => {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw new Error("useUserInfo must be used within a UserInfoProvider");
  }
  return context;
};
