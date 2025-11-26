import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen flex flex-col gap-10 bg-white pt-4 px-3 sm:px-6 md:px-10 pb-10">
      {/* Header + BackButton */}
      <div className="w-full max-w-md mx-auto flex flex-col gap-2">
        <button
          className="w-12 h-12 rounded-full bg-[#DADADA] flex items-center justify-center"
          onClick={() => navigate("/login")}
        >
          <img src="/svg/arrow-left.svg" alt="Back" className="h-8" />
        </button>

        <h1 className="text-3xl poppins-bold">Forgot Password</h1>
        <p className="text-sm text-gray-600 poppins-light pt-1 mb-6">
          To reset your password, please verify your identity.
        </p>
      </div>

      {/* Form Inputs */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-md mx-auto flex flex-col gap-4">
          {/* Phone Number */}
          <div className="relative">
            <img
              src="/svg/call.svg"
              alt="Call logo"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6"
            />
            <input
              type="tel"
              placeholder="Enter Phone number"
              className="bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4 focus:outline-none"
            />
          </div>

          {/* OTP */}
          <div className="relative">
            <img
              src="/svg/lock.svg"
              alt="Lock logo"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6"
            />
            <input
              type="tel"
              placeholder="Enter OTP"
              className="bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col items-center mt-6">
        <div className="w-full max-w-md mx-auto flex flex-col gap-4">
          <button className="text-white bg-[#0385C2] rounded-full h-12 w-full flex items-center justify-center hover:scale-95 active:scale-90 transition">
            <p className="poppins-semibold text-xl">Send OTP</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
