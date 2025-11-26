import { useEffect, useRef, useState, type FC } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";

type PaymentMethod = "cod" | "online" | "wallet";

interface Payment {
  id: number;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: string;
}

interface BaseProps {
  jobId?: number;
  isOpen: boolean;
  isSubmitting: boolean;
  currentStatus: string;
  onCancel: () => void;
  onConfirm: (newStatus: string) => Promise<void>;
}

interface WorkerModalProps extends BaseProps {
  isWorker: boolean;
  payment: Payment;
}

interface NonWorkerModalProps extends BaseProps {
  isWorker?: false;
  payment?: never; // ensures you *can’t* pass payment accidentally
}

type UpdateStatusModalProps = WorkerModalProps | NonWorkerModalProps;
// interface UpdateStatusModalProps {
//   jobId?: number;
//   isOpen: boolean;
//   isSubmitting: boolean;
//   currentStatus: string;
//   onCancel: () => void;
//   onConfirm: (newStatus: string) => Promise<void>;
//   isWorker?: boolean;
//   payment: Payment;
// }

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
  jobId,
  isOpen,
  isSubmitting,
  currentStatus,
  onCancel,
  onConfirm,
  isWorker,
  payment,
}) => {
  const [show, setShow] = useState(isOpen);
  const [showPaymentWarning, setShowPaymentWarning] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const nextStatus = STATUS_FLOW[currentStatus] || null;
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  const STEP_HEIGHT = 49;
  const ANIMATION_DURATION = 700;

  const [progressHeight, setProgressHeight] = useState(0);
  const [animatedIndex, setAnimatedIndex] = useState(currentIndex);
  const prevIndexRef = useRef(currentIndex);

  // Animate progress height
  useEffect(() => {
    const targetHeight = currentIndex * STEP_HEIGHT;
    if (progressHeight !== targetHeight) setProgressHeight(targetHeight);
  }, [currentIndex, progressHeight]);

  // Animate step circles
  useEffect(() => {
    if (prevIndexRef.current === currentIndex) {
      setProgressHeight(currentIndex * STEP_HEIGHT);
      setAnimatedIndex(currentIndex);
      return;
    }

    const oldIndex = prevIndexRef.current;
    const newIndex = currentIndex;
    const stepDuration = ANIMATION_DURATION / Math.abs(newIndex - oldIndex);
    let currentStep = oldIndex;

    const interval = setInterval(() => {
      if (currentStep < newIndex) currentStep++;
      else if (currentStep > newIndex) currentStep--;

      setProgressHeight(currentStep * STEP_HEIGHT);
      setAnimatedIndex(currentStep);

      if (currentStep === newIndex) {
        clearInterval(interval);
        prevIndexRef.current = newIndex;
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Handle show/hide animation
  useEffect(() => {
    if (isOpen) setShow(true);
    else setTimeout(() => setShow(false), 200);
  }, [isOpen]);

  // Reset payment warning each time modal closes or job changes
  useEffect(() => {
    if (!isOpen) setShowPaymentWarning(false);
  }, [isOpen, jobId]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showPaymentWarning) return; // disable when payment modal open
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
  }, [isOpen, showPaymentWarning]);

  if (!show) return null;

  // ✅ Helper for confirming status
  const handleConfirmClick = async () => {
    if (isWorker && nextStatus === "completed" && payment.method === "cod") {
      setShowPaymentWarning(true);
    } else {
      await onConfirm(nextStatus!);
    }
  };

  return (
    <>
      {createPortal(
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
              <div
                className="absolute top-px left-[9px] w-px bg-green-500 z-10 transition-all duration-700 ease-in-out"
                style={{ height: `${progressHeight}px` }}
              />
              <div className="absolute top-px left-[9px] w-px h-[99%] bg-gray-300 z-0" />

              <div className="flex flex-col gap-7 relative z-20">
                {STATUS_ORDER.map((status, index) => {
                  const isReached = index <= animatedIndex;
                  return (
                    <div key={status} className="flex items-center">
                      <svg width="20" height="20">
                        <circle
                          cx="10"
                          cy="10"
                          r="8"
                          stroke={isReached ? "#10B981" : "#D1D5DB"}
                          strokeWidth="2"
                          fill={isReached ? "#10B981" : "white"}
                        />
                      </svg>
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
                  onClick={handleConfirmClick}
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
      )}

      {/* ✅ Payment Confirmation Modal in its own portal */}
      {isWorker &&
        showPaymentWarning &&
        createPortal(
          <div
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="mb-4 text-gray-800 font-medium">
                Did you collect the payment of{" "}
                <b className="text-red-500">₹{payment.amount}</b> ?
              </p>
              <div className="flex justify-center gap-3">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setShowPaymentWarning(false)}
                >
                  No
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={() => {
                    setShowPaymentWarning(false);
                    onConfirm("completed");
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default UpdateStatusModal;
