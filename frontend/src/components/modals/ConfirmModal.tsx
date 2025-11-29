import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
  confirmButtonName?: string;
}

const ConfirmModal = ({
  isOpen,
  onConfirm,
  onCancel,
  message = "Are you sure?",
  confirmButtonName = "Delete",
}: ConfirmModalProps) => {
  const [show, setShow] = useState(isOpen);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      // Add a slight delay before unmounting to allow animation
      setTimeout(() => setShow(false), 200);
    }
  }, [isOpen]);

  // Handle click outside
  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onCancel();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!show) return null;

  return createPortal(
    <div
      onClick={(e) => e.stopPropagation()}
      className={classNames(
        "fixed inset-0 z-50 flex items-center justify-center bg-gray-300/40  transition-opacity duration-200",
        {
          "opacity-100": isOpen,
          "opacity-0 pointer-events-none": !isOpen,
        }
      )}
    >
      <div
        ref={modalRef}
        className={classNames(
          "bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md transform transition-transform duration-200",
          {
            "scale-100": isOpen,
            "scale-95": !isOpen,
          }
        )}
      >
        <p className="text-lg text-gray-800 mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700 hover:bg-gray-400 cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
            onClick={onConfirm}
          >
            {confirmButtonName}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
