import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col gap-10 bg-white pt-4 px-3  ">
      {/* Back button */}
      <button
        className="w-12 h-12 rounded-full bg-[#DADADA] flex items-center justify-center "
        onClick={() => navigate("/login")}
      >
        <img src="/svg/arrow-left.svg" alt="Back" className="  h-8 " />
      </button>

      {/* Heading */}
      <div className="w-11/12">
        <h1 className="text-3xl  poppins-bold ">Forgot Password</h1>
        <p className="text-sm text-gray-600 poppins-light pt-1">
          To continue to reset you password first verify your indentity
        </p>
      </div>

      {/* Form */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex flex-col gap-4 pt-2">
          <div className="relative">
            <img
              src="/svg/call.svg"
              alt="Call logo"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6"
            />
            <input
              type="tel"
              placeholder="Enter Phone number"
              className="bg-[#F4F4F4]  rounded-full h-14 w-full pl-12 pr-4 focus:outline-none focus:ring"
            />
          </div>
          <div className="relative">
            <img
              src="/svg/lock.svg"
              alt="Lock logo"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6"
            />
            <input
              type="number"
              placeholder="Enter OTP"
              className="bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4 focus:outline-none focus:ring"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col items-center">
        <div className="w-8/12 flex flex-col gap-4">
          <button className=" text-white bg-[#0385C2] rounded-full h-12 cursor-pointer select-none  transform transition ease-in-out duration-300 hover:scale-95 active:scale-90">
            <p className="poppins-semibold text-xl">Send OTP</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
