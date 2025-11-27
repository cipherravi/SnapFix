import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useSelector } from "react-redux";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ 1. Define the type of your context
interface AuthContextType {
  isLoggedIn: boolean | null;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

// ✅ 2. Create context with proper type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ 3. Define the props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = loading
  const token = useSelector((s: any) => s.auth.token);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${VITE_API_BASE_URL}/api/v1/check-auth`, {
        credentials: "include", // Send cookies
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsLoggedIn(res?.ok || false);
    } catch (err) {
      setIsLoggedIn(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${VITE_API_BASE_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsLoggedIn(false);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ 4. Add safety check to useAuth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
