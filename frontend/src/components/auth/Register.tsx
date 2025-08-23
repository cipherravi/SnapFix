import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BackButton from "../Buttons/BackButton";
import toast from "react-hot-toast";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const navigate = useNavigate();
  const [checkPassword, setCheckPassword] = useState(false);
  const [phone, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Only allow 10-digit numbers that start with 6,7,8, or 9
    if (/^[6-9]\d{0,9}$/.test(newValue) || newValue === "") {
      setPhoneNo(newValue);
    }
  };

  async function registerHandler() {
    try {
      if (phone.length !== 10) {
        toast.error("Mobile number must be 10 digits.");
        return;
      }

      if (password.length < 8) {
        toast.error("Password must be atleast 8 digit");
        return;
      }
      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include", // 🔥 critical to include cookies in request
        body: JSON.stringify({ phone, password }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Login successfully!");
        setPhoneNo("");
        setPassword("");
        navigate("/explore");
      } else {
        toast.error(data.message || "Login failed!");
      }
    } catch (err) {
      toast.error("An error occurred while Login.");
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-10 bg-white pt-4 px-3  ">
      <BackButton navigateTo="/" />

      {/* Heading */}
      <div className="w-11/12">
        <h1 className="text-3xl  poppins-bold  ">Register Now</h1>
        <p className="text-sm text-gray-600 poppins-light pt-1">
          Sign up with your phone number and password to continue
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
              value={phone}
              onChange={handleChange}
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
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              min={8}
              maxLength={30}
              className="bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4 focus:outline-none focus:ring"
            />
            <img
              src={checkPassword ? "/svg/eye-slash.svg" : "/svg/eye.svg"}
              alt="Toggle password visibility"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 cursor-pointer"
              onClick={() => setCheckPassword(!checkPassword)}
            />
          </div>
          <div className="relative">
            <img
              src="/svg/lock.svg"
              alt="Lock logo"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              min={8}
              maxLength={30}
              className="bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4  focus:outline-none focus:ring "
            />
            <img
              src={checkPassword ? "/svg/eye-slash.svg" : "/svg/eye.svg"}
              alt="Toggle password visibility"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 cursor-pointer"
              onClick={() => setCheckPassword(!checkPassword)}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col items-center">
        <div className="w-8/12 flex flex-col gap-4">
          <button
            className=" text-white bg-[#0385C2]  rounded-full h-12 cursor-pointer select-none  transform transition ease-in-out duration-300 hover:scale-95 active:scale-90"
            onClick={registerHandler}
          >
            <p className="poppins-semibold text-xl">Sign up</p>
          </button>
          <p className="text-center text-sm text-gray-500 poppins-regular">
            Or continue with
          </p>
          <button className="bg-[#F8F8F8] rounded-full h-12 flex items-center justify-center gap-3 cursor-pointer select-none  transform transition ease-in-out duration-300 hover:scale-95 active:scale-90">
            <span>
              <img
                src="/svg/google-icon.svg"
                alt="Google icon"
                className="h-6"
              />
            </span>
            <span className=" poppins-regular"> Continue with Google</span>
          </button>
          <p className="text-center text-sm poppins-extralight">
            Already have an account?
            <b className="font-bold">
              <Link to="/login"> Sign In</Link>
            </b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
