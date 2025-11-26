import { type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isLoggedIn } = useAuth();
  const isAuthenticated = useSelector((s: any) => s.auth.isAuthenticated);

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    ); // Optional: loading spinner
  }
  return isAuthenticated ? <Navigate to="/explore" replace /> : children;
};

export default PublicRoute;
