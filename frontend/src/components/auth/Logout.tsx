import { useAuth } from "../../utils/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../../features/user/userSlice";
import { setUnauthenticated, removeToken } from "../../features/auth/authSlice";
import {
  clearConversations,
  clearUnreadCount,
} from "../../features/conversation/conversationSlice";
import { api } from "../../services/api/api";
import { clearToken } from "../../utils/tokenDB";
import { useState } from "react";
import ConfirmModal from "../modals/ConfirmModal";
import { useSocket } from "../../utils/context/SocketContext";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useSocket();
  const [isVisible, setIsVisible] = useState(false);

  const { logout, checkAuth } = useAuth();

  const confirmLogout = async () => {
    socket.disconnect();
    dispatch(clearUser());
    dispatch(setUnauthenticated());
    dispatch(removeToken());
    dispatch(clearConversations());
    dispatch(clearUnreadCount());
    dispatch(api.util.resetApiState());
    clearToken();
    await logout();
    await checkAuth();
    navigate("/login");
  };

  const cancelLogout = async () => {
    setIsVisible(false);
  };

  return (
    <>
      <button
        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 border px-4 py-2 rounded-3xl bg-[#0385c2] text-white inter-regular text-sm sm:text-base cursor-pointer"
        onClick={() => setIsVisible(true)}
      >
        Logout
      </button>
      <ConfirmModal
        isOpen={isVisible}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        message="Do you really want to logout ?"
        confirmButtonName="Yes"
      />
    </>
  );
};

export default Logout;
