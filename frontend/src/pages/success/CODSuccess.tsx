import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CODSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown === 0) {
      navigate("/explore");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-400 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center">
        {/* ✅ Animated Tick */}
        <div className="flex justify-center mb-6">
          <svg
            className="w-24 h-24 text-green-500 success-icon"
            viewBox="0 0 52 52"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Circle outline */}
            <circle
              className="success-circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            {/* Tick mark */}
            <path
              className="success-check"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14 27l7 7 16-16"
            />
          </svg>
        </div>

        {/* ✅ Messages */}
        <h2 className="text-2xl font-bold text-gray-800">
          Job Created Successfully 🎉
        </h2>
        <p className="text-gray-600 mt-2">
          Your order is placed with <b>Cash on Delivery</b>. Payment is pending.
        </p>

        {/* ✅ Countdown */}
        <p className="text-gray-500 text-sm mt-4">
          Redirecting to explore in{" "}
          <span className="font-semibold">{countdown}s...</span>
        </p>
      </div>

      {/* ✅ Animations */}
      <style>{`
        /* Circle draw animation */
        .success-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-linecap: round;
          animation: circleAnimation 0.6s ease-in-out forwards;
        }

        /* Tick draw animation */
        .success-check {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: checkAnimation 0.4s ease-in-out 0.6s forwards;
        }

        /* Icon pop (fade + bounce) */
        .success-icon {
          // opacity: 0;
          transform: scale(0.5);
          animation: popIn 1.5s ease-out forwards;
        }

        @keyframes circleAnimation {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes checkAnimation {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default CODSuccess;
