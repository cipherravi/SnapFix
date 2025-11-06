import { useAuth } from "../utils/context/AuthContext";
import { Outlet } from "react-router-dom";

const Profile = () => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? (
    <div className="min-h-screen flex flex-col justify-between">
      <Outlet />
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
