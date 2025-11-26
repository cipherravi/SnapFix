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
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle open/close animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      const t = setTimeout(() => setIsVisible(false), 250);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Click outside closes modal
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onCancel]);

  // Enter to confirm
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isOpen) {
        e.preventDefault();
        onConfirm();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onConfirm]);

  if (!isVisible) return null;

  return createPortal(
    <div
      className={classNames(
        "fixed inset-0 z-5000 flex items-center justify-center",
        "backdrop-blur-xl bg-black/40 transition-all duration-300",
        {
          "opacity-100": isOpen,
          "opacity-0 pointer-events-none": !isOpen,
        }
      )}
    >
      {/* Modal Card */}
      <div
        ref={modalRef}
        className={classNames(
          "relative w-[90%] max-w-md p-7 rounded-3xl",
          "bg-white/10 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)]",
          "border border-white/20 transition-all duration-300",
          {
            "scale-100 opacity-100": isOpen,
            "scale-95 opacity-0": !isOpen,
          }
        )}
      >
        {/* Glow Orb */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 blur-2xl rounded-full animate-pulse-slow"></div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-white drop-shadow mb-4">
          {action === "add" ? "Add Money" : "Withdraw Money"}
        </h1>

        {/* Input */}
        <div className="mt-4">
          <label className="text-white/70 text-sm">Enter Amount</label>
          <input
            ref={inputRef}
            type="number"
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="₹ 0.00"
            className="
              mt-2 w-full p-3 rounded-2xl bg-white/20 text-white
              placeholder-white/60 outline-none border border-white/20
              focus:border-white/40 focus:bg-white/25 transition-all
            "
          />
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="
              px-5 py-2 rounded-xl text-white bg-white/10 
              hover:bg-white/20 transition-all shadow
              active:scale-95
            "
          >
            Cancel
          </button>

          <button
            disabled={handling}
            onClick={onConfirm}
            className={classNames(
              "px-6 py-2 rounded-xl shadow text-white font-semibold active:scale-95 transition-all",
              {
                "bg-green-500 hover:bg-green-600": action === "add",
                "bg-blue-500 hover:bg-blue-600": action === "withdraw",
                "opacity-50 cursor-not-allowed": handling,
              }
            )}
          >
            {handling ? "Processing..." : action === "add" ? "Add" : "Withdraw"}
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes pulse-slow {
            0% { opacity: .3; transform: scale(.95); }
            50% { opacity: .6; transform: scale(1); }
            100% { opacity: .3; transform: scale(.95); }
          }
        `}
      </style>
    </div>,
    document.body
  );
};

export default ManageFundsModal;
