import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import { Bell, BellRing } from "lucide-react";
import { useSelector } from "react-redux";

import { initNotifications } from "../../notifications";

type RootState = any;

type Props = {
  open: boolean;
  onClose: () => void;
};

const NotificationPermissionModal = ({ open, onClose }: Props) => {
  const authToken = useSelector((s: RootState) => s.auth.token);

  const [isVisible, setIsVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  // Mount/unmount animation
  useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      const t = setTimeout(() => setIsVisible(false), 250);

      return () => clearTimeout(t);
    }
  }, [open]);

  // Click outside closes
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleSkip();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [open]);

  // ESC closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };

    if (open) {
      document.addEventListener("keydown", handler);
    }

    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [open]);

  const handleEnable = async () => {
    try {
      setLoading(true);

      await initNotifications({
        authToken,
      });

      localStorage.setItem("notifications_prompted", "true");

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("notifications_prompted", "true");

    onClose();
  };

  if (!isVisible) return null;

  return createPortal(
    <div
      className={classNames(
        "fixed inset-0 z-9999",
        "flex items-center justify-center",
        "bg-black/30 backdrop-blur-xs",
        "transition-all duration-200",
        {
          "opacity-100": open,
          "opacity-0 pointer-events-none": !open,
        },
      )}
    >
      {/* Modal */}
      <div
        ref={modalRef}
        className={classNames(
          `
        relative
        w-[90%]
        max-w-90

        rounded-3xl

        border border-white/10
        bg-white/10

        backdrop-blur-md

        shadow-[0_10px_40px_rgba(0,0,0,0.25)]

        px-5
        py-6

        transition-all duration-200
        `,
          {
            "scale-100 opacity-100 translate-y-0": open,

            "scale-95 opacity-0 translate-y-2": !open,
          },
        )}
      >
        {/* Small Glow */}
        <div
          className="
          absolute
          -top-10
          right-0

          h-24
          w-24

          rounded-full
          bg-blue-400/10
          blur-2xl
        "
        />

        {/* Icon */}
        <div
          className="
          relative z-10

          mx-auto

          flex
          h-14
          w-14

          items-center
          justify-center

          rounded-2xl

          border border-white/10
          bg-white/10
        "
        >
          <BellRing
            className="
            h-7
            w-7
            text-white
          "
          />
        </div>

        {/* Content */}
        <div className="relative z-10 mt-4 text-center">
          <h2
            className="
            text-lg
            font-semibold
            text-white
          "
          >
            Enable Notifications
          </h2>

          <p
            className="
            mt-2

            text-sm
            leading-5

            text-white/70
          "
          >
            Get alerts for messages, activity, and important updates.
          </p>
        </div>

        {/* Buttons */}
        <div
          className="
          relative z-10

          mt-6

          flex
          gap-2
        "
        >
          <button
            onClick={handleSkip}
            className="
            flex-1

            rounded-2xl

            border border-white/10

            bg-white/5

            py-3

            text-sm
            font-medium
            text-white

            transition-all

            hover:bg-white/10
            active:scale-[0.98]
          "
          >
            Later
          </button>

          <button
            onClick={handleEnable}
            disabled={loading}
            className={classNames(
              `
            flex-1

            rounded-2xl

            bg-white

            py-3

            text-sm
            font-semibold
            text-black

            transition-all

            hover:bg-white/90
            active:scale-[0.98]
            `,
              {
                "opacity-50 cursor-not-allowed": loading,
              },
            )}
          >
            {loading ? "Enabling..." : "Enable"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default NotificationPermissionModal;
