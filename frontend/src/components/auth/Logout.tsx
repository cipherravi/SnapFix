import { useAuth } from "../../utils/context/AuthContext";
import { useNavigate } from "react-router-dom";
const Logout = () => {
  const navigate = useNavigate();
  const { logout, checkAuth } = useAuth();
  return (
    <button
      className="w-1/2  border px-4 py-2 rounded-3xl bg-[#0385c2] text-white inter-regular"
      onClick={async () => {
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
