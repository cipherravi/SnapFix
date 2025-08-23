import { type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    ); // Optional: loading spinner
  }
  return isLoggedIn ? <Navigate to="/explore" replace /> : children;
};

export default PublicRoute;
