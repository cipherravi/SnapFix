import { useAuth } from "../../utils/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../../features/user/userSlice";
import { setUnauthenticated, removeToken } from "../../features/auth/authSlice";
import { api } from "../../services/api/api";
import { clearToken } from "../../utils/tokenDB";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout, checkAuth } = useAuth();
  return (
    <button
      className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 border px-4 py-2 rounded-3xl bg-[#0385c2] text-white inter-regular text-sm sm:text-base cursor-pointer"
      onClick={async () => {
        dispatch(clearUser());
        dispatch(setUnauthenticated());
        dispatch(removeToken());
        dispatch(api.util.resetApiState());
        clearToken();
        await logout();
        await checkAuth();
        navigate("/login");
      }}
    >
      Logout
    </button>
  );
};

export default Logout;
