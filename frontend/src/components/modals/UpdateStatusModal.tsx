import { useEffect, useRef, useState, type FC } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

interface UpdateStatusModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  currentStatus: string;
  onCancel: () => void;
  onConfirm: (newStatus: string) => Promise<void>;
  isWorker?: boolean;
}

// Status order & flow
const STATUS_FLOW: Record<string, string | null> = {
  assigned: "started",
  started: "in_progress",
  in_progress: "completed",
  completed: "approved",
  approved: null,
};

const STATUS_ORDER = [
  "assigned",
  "started",
  "in_progress",
  "completed",
  "approved",
];

const UpdateStatusModal: FC<UpdateStatusModalProps> = ({
  isOpen,
  isSubmitting,
  currentStatus,
  onCancel,
  onConfirm,
  isWorker,
}) => {
  const [show, setShow] = useState(isOpen);
  const modalRef = useRef<HTMLDivElement>(null);
  const nextStatus = STATUS_FLOW[currentStatus] || null;

  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const STEP_HEIGHT = 49; // Adjust to match your spacing
  const ANIMATION_DURATION = 700; // Match this to your CSS transition duration

  // 👇 Manage animated progress height
  const [progressHeight, setProgressHeight] = useState(0);
  const [animatedIndex, setAnimatedIndex] = useState(currentIndex);
  const prevIndexRef = useRef(currentIndex);

  useEffect(() => {
    // 1. Calculate the target height based on the new index
    const targetHeight = currentIndex * STEP_HEIGHT;

    // 2. Only update the height if it has actually changed
    // This is the simplest way to rely on the CSS transition:
    // the previous render's progressHeight is the "start" point,
    // and the new state is the "end" point.
    if (progressHeight !== targetHeight) {
      setProgressHeight(targetHeight);
    }

    // NOTE: prevIndexRef and the requestAnimationFrame logic
    // is often unnecessary for simple CSS transitions like this
    // unless you need to *explicitly* set a starting point
    // that is *not* the current state.
    // For a progressive bar moving up, simply setting the new
    // height is usually enough, as the previous render's height
    // acts as the starting point for the transition.
  }, [currentIndex, progressHeight]); // Depend on currentIndex
  useEffect(() => {
    // Only run if the target status has changed
    if (prevIndexRef.current === currentIndex) {
      setProgressHeight(currentIndex * STEP_HEIGHT);
      setAnimatedIndex(currentIndex); // Initial setup
      return;
    }

    const oldIndex = prevIndexRef.current;
    const newIndex = currentIndex;
    const stepDuration = ANIMATION_DURATION / Math.abs(newIndex - oldIndex); // Time for each individual step (e.g., 700ms / 2 steps = 350ms per step)

    let currentStep = oldIndex;

    const interval = setInterval(() => {
      // Determine the next step direction
      if (currentStep < newIndex) {
        currentStep++;
      } else if (currentStep > newIndex) {
        currentStep--;
      }

      // 1. Update the line's target height (triggers CSS transition)
      setProgressHeight(currentStep * STEP_HEIGHT);

      // 2. Update the animated index (triggers circle color change)
      setAnimatedIndex(currentStep);

      // 3. Stop the interval when the final index is reached
      if (currentStep === newIndex) {
        clearInterval(interval);
        prevIndexRef.current = newIndex;
      }
    }, stepDuration); // Run the update after the duration for ONE step

    return () => clearInterval(interval); // Cleanup on unmount or re-run
  }, [currentIndex]); // Only depend on currentIndex to trigger

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 200); // Delay for animation
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!show) return null;
  console.log(isSubmitting);
  return createPortal(
    <div
      onClick={(e) => e.stopPropagation()}
      className={classNames(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-200",
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
        <h2 className="text-xl poppins-semibold mb-6 text-center">
          Update Job Status
        </h2>

        {/* Stepper */}
        <div className="relative ml-6 mb-6">
          {/* Green progress line */}
          <div
            className="absolute top-[1px] left-[9px] w-px bg-green-500 z-10  transition-all duration-700 ease-in-out"
            style={{ height: `${progressHeight}px` }}
          />

          {/* Full gray line */}
          <div className="absolute top-[1px] left-[9px] w-px h-[99%] bg-gray-300 z-0" />

          <div className="flex flex-col gap-7 relative z-20">
            {STATUS_ORDER.map((status, index) => {
              const isReached = index <= animatedIndex;

              return (
                <div key={status} className="flex items-center">
                  {/* Circle */}
                  <svg
                    width="20"
                    height="20"
                    className="flex-shrink-0 transition-all duration-900 ease-in-out"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="8"
                      stroke={isReached ? "#10B981" : "#D1D5DB"}
                      strokeWidth="2"
                      fill={isReached ? "#10B981" : "white"}
                    />
                  </svg>

                  {/* Label */}
                  <div className="ml-4 text-sm font-medium capitalize text-gray-800">
                    {status.replace("_", " ")}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-sm font-medium text-gray-700"
          >
            Cancel
          </button>

          {nextStatus && (!isWorker || currentStatus !== "completed") && (
            <button
              onClick={() => onConfirm(nextStatus)}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isSubmitting
                ? "Updating..."
                : `Move to "${nextStatus.replace("_", " ")}"`}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UpdateStatusModal;
