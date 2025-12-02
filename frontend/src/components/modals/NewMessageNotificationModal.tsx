import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useNotificationQueue } from "../../utils/context/NotificationQueueContext";

const SWIPE_THRESHOLD = 80; // px to trigger dismiss

const NewMessageNotification: React.FC = () => {
  const { current, dismiss } = useNotificationQueue();
  const navigate = useNavigate();

  if (!current) return null;

  const handleNavigate = () => {
    navigate(`/conversation/${current.conversationId}`);
    dismiss();
  };

  return (
    <AnimatePresence mode="wait">
      {current && (
        <motion.div
          key={current.conversationId} // triggers replacement animation
          className="fixed top-6 left-0 right-0 flex justify-center z-50 px-4"
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 500, damping: 30 },
          }}
          exit={{
            opacity: 0,
            y: 50, // slide down when replaced
            scale: 0.9,
            transition: { duration: 0.25 },
          }}
        >
          <motion.div
            className="
              backdrop-blur-xl bg-white/90 dark:bg-gray-900/80
              shadow-lg border border-white/30 dark:border-gray-700/30
              rounded-2xl px-4 py-3 w-full max-w-md
              flex items-center gap-4 cursor-pointer select-none
            "
            whileTap={{ scale: 0.97 }}
            drag="y"
            dragDirectionLock
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              // If user swipes up or down past threshold, dismiss
              if (Math.abs(info.offset.y) > SWIPE_THRESHOLD) {
                dismiss();
              }
            }}
            onClick={handleNavigate}
          >
            {/* Avatar */}
            <motion.img
              src={current.profilePicUrl}
              alt="profile"
              className="w-12 h-12 rounded-full object-cover shadow border border-white/40"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
            />

            {/* Content */}
            <div className="flex flex-col flex-1">
              <motion.p
                className="font-semibold text-gray-900 dark:text-white text-[15px] leading-tight"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {current.sender}
              </motion.p>
              <motion.p
                className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {current.text}
              </motion.p>
            </div>

            {/* Dot Indicator */}
            <motion.div
              className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.25 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewMessageNotification;
