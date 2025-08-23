import { useAuth } from "../utils/context/AuthContext";
import { Outlet } from "react-router-dom";

const Profile = () => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? (
    <div className="w-full min-h-full bg-white ">
      <Outlet />
    </div>
  ) : (
    <div className="bg-white w-full h-full flex justify-center items-center">
      <h1>Please Login 🥺</h1>
    </div>
  );
};

export default Profile;
