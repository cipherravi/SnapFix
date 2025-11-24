import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SocketContext = createContext<Socket | null>(null);

type SocketProviderProps = {
  children: ReactNode;
};

const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(VITE_API_BASE_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket ? (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  ) : null;
};

export default SocketProvider;

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
