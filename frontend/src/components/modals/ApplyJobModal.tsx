import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

interface ApplyJobModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const ApplyJobModal = ({
  isOpen,
  onConfirm,
  onCancel,
  message = "Send Custom message for Client",
  setMessage,
}: ApplyJobModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Open / close animation visibility
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      // Delay unmounting to allow fade-out animation
      const timeout = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onCancel]);

  if (!isVisible) return null;

  return createPortal(
    <div
      className={classNames(
        "fixed inset-0 z-5000 flex items-center justify-center bg-gray-300/40 transition-opacity duration-200",
        {
          "opacity-100": isOpen,
          "opacity-0 pointer-events-none": !isOpen,
        }
      )}
    >
      <div
        ref={modalRef}
        className={classNames(
          "bg-white w-[90%] max-w-md p-6 rounded-xl shadow-lg transform transition-transform duration-200",
          "flex flex-col gap-4",
          {
            "scale-100": isOpen,
            "scale-95": !isOpen,
          }
        )}
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <p className="text-base text-gray-800">{message}</p>

        <textarea
          //   value={message || ""}
          className="w-full h-28 resize-none border rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={150}
          placeholder="Type a message to client"
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ApplyJobModal;
