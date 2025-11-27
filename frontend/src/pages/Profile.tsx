import { useAuth } from "../utils/context/AuthContext";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Suspense } from "react";
import ProfileShimmer from "../components/shimmer/ProfileShimmer";

const Profile = () => {
  const isAuthenticated = useSelector((s: any) => s.auth.isAuthenticated);

  return isAuthenticated ? (
    <div className="min-h-screen flex flex-col justify-between">
      <Suspense fallback={<ProfileShimmer />}>
        <Outlet />
      </Suspense>
    </div>
  ) : (
    <div className="bg-white w-full h-screen flex justify-center items-center">
      <h1 className="text-lg sm:text-xl md:text-2xl text-gray-700">
        Please Login 🥺
      </h1>
    </div>
  );
};

export default Profile;
