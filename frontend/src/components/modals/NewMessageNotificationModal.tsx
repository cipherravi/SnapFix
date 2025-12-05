import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useNotificationQueue } from "../../utils/context/NotificationQueueContext";
import { useFetchProfileImageQuery } from "../../services/api/assetApi";

const SWIPE_THRESHOLD = 80; // px to trigger dismiss

const NewMessageNotification: React.FC = () => {
  const { current, dismiss } = useNotificationQueue();
  const navigate = useNavigate();

  const { data: profileImageUrlFromApi } = useFetchProfileImageQuery(
    current?.profilePicUrl!,
    {
      skip: !current?.profilePicUrl,
    }
  );

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
          // Initial appearance animation (more impactful spring)
          initial={{ opacity: 0, y: -80, scale: 0.8 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 250,
              damping: 25,
              delay: 0.1,
            },
          }}
          // Exit animation (swipe out to the side)
          exit={{
            x: 300,
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.3 },
          }}
        >
          <motion.div
            className="
                relative
                w-full max-w-md
                bg-gray-900/90 backdrop-blur-3xl
                shadow-2xl shadow-blue-500/20
                rounded-2xl p-4
                flex items-start gap-4
                cursor-pointer select-none
                overflow-hidden
                transition-shadow duration-300 ease-in-out
                hover:shadow-blue-500/40
              "
            // Interactive feedback
            whileTap={{
              scale: 0.98,
              boxShadow: "0 10px 20px rgba(59, 130, 246, 0.5)",
            }}
            // Allow horizontal drag/swipe to dismiss
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragDirectionLock
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
                dismiss();
              }
            }}
            onClick={handleNavigate}
          >
            {/* Avatar */}
            <motion.img
              src={profileImageUrlFromApi || "/svg/profile.svg"}
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

            {/* Decorative Glass Effect (Overlay) */}
            <div className="absolute inset-0 border-2 border-white/10 rounded-2xl pointer-events-none z-10"></div>
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
