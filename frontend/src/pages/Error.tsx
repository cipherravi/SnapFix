import { useRouteError, Link } from "react-router-dom";

const Error = () => {
  const error = useRouteError() as {
    status?: number;
    statusText?: string;
    message?: string;
  };
  console.error(error);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-linear-to-b from-blue-50 to-white text-gray-800 px-6">
      {/* Floating Illustration */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-6">
        {/* Glow bubbles */}
        <div className="absolute w-10 h-10 bg-blue-300/40 rounded-full animate-ping top-6 left-8"></div>
        <div className="absolute w-6 h-6 bg-purple-300/40 rounded-full animate-ping bottom-10 right-14"></div>

        {/* Cute robot illustration (inline SVG) */}
        <svg
          className="w-56 h-56 animate-bounce drop-shadow-lg"
          viewBox="0 0 200 200"
          fill="none"
        >
          {/* Body */}
          <rect x="40" y="70" width="120" height="90" rx="20" fill="#4f46e5" />

          {/* Eyes */}
          <circle cx="80" cy="110" r="10" fill="white" />
          <circle cx="120" cy="110" r="10" fill="white" />

          {/* Eye pupils */}
          <circle cx="82" cy="112" r="4" fill="#000" />
          <circle cx="122" cy="112" r="4" fill="#000" />

          {/* Head */}
          <rect x="55" y="30" width="90" height="50" rx="15" fill="#6366f1" />

          {/* Antenna */}
          <line
            x1="100"
            y1="15"
            x2="100"
            y2="30"
            stroke="#6366f1"
            strokeWidth="6"
          />
          <circle
            cx="100"
            cy="10"
            r="6"
            fill="#4f46e5"
            className="animate-pulse"
          />

          {/* Mouth */}
          <rect x="80" y="130" width="40" height="10" rx="4" fill="#111827" />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="text-5xl font-bold mb-2 drop-shadow-sm">
        {error?.status || 404}
      </h1>

      {/* Message */}
      <p className="text-center text-gray-600 max-w-md mb-6">
        {error?.statusText ||
          error?.message ||
          "Oops! Our friendly robot got confused and can't find this page."}
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <Link
          to="/"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Back Home
        </Link>

        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default Error;
