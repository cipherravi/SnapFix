import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

interface ManageFundsModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  handling: boolean;
  action: "add" | "withdraw";
}

const ManageFundsModal = ({
  isOpen,
  onConfirm,
  onCancel,
  setAmount,
  handling,
  action,
}: ManageFundsModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // ✅ Ref for input

  // Open / close animation visibility
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);

      // Wait for modal to render before focusing input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
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

  // ✅ Trigger "Add || Withdraw" when Enter is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isOpen) {
        e.preventDefault();
        onConfirm();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onConfirm]);

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
        <div className="flex flex-col gap-4">
          <h1 className="text-xl inter-semibold">
            {action == "add"
              ? "Add Money into Wallet"
              : "Withdraw Money from Wallet"}
          </h1>
          <input
            ref={inputRef} // ✅ assign ref to input
            type="number"
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Enter Amount"
            className="w-full h-10 border p-2 rounded-xl"
          />
        </div>
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
            disabled={handling}
          >
            {action == "add" ? "Add" : "Withdraw"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ManageFundsModal;
