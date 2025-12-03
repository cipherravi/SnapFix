import {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
  useEffect,
} from "react";
import { useDispatch } from "react-redux";
import { setNewMessage } from "../../features/conversation/conversationSlice";

export interface NotificationItem {
  senderId: number;
  sender: string;
  text: string;
  profilePicUrl?: string;
  conversationId: string;
  currentConversationId?: string;
}

interface NotificationContextType {
  pushNotification: (msg: NotificationItem) => void;
  current: NotificationItem | null;
  dismiss: () => void;
}

const NotificationQueueContext = createContext<NotificationContextType | null>(
  null
);

export const NotificationQueueProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const [current, setCurrent] = useState<NotificationItem | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const AUTO_HIDE_MS = 3000;

  const vibrate = () => {
    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(80);
      } catch {}
    }
  };

  // Push a new notification, replacing current immediately
  const pushNotification = (msg: NotificationItem) => {
    // Ignore if the message is from the same conversation user is currently viewing

    if (
      msg.currentConversationId &&
      msg.currentConversationId === msg.conversationId
    )
      return;
    setCurrent(msg); // replace current
    dispatch(setNewMessage(msg));
    vibrate();
    resetTimer();
  };

  const dismiss = () => {
    setCurrent(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCurrent(null);
    }, AUTO_HIDE_MS);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <NotificationQueueContext.Provider
      value={{ pushNotification, current, dismiss }}
    >
      {children}
    </NotificationQueueContext.Provider>
  );
};

export const useNotificationQueue = () => {
  const context = useContext(NotificationQueueContext);
  if (!context)
    throw new Error(
      "useNotificationQueue must be inside NotificationQueueProvider"
    );
  return context;
};
