import { Outlet } from "react-router-dom";
const Admin = () => {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white">
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

      <Outlet />
    </div>
  );
};

export default Admin;
