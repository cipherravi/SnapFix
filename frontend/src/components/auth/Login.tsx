import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import toast from "react-hot-toast";
import { useAuth } from "../../utils/context/AuthContext";
import { useUserInfo } from "../../utils/context/UserInfoContext";
import BackButton from "../Buttons/BackButton";
import { useConversation } from "../../utils/context/CoversationContext";

const Login = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const { fetchProfile } = useUserInfo();
  const { fetchConversations } = useConversation();
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginWithEmail, setLoginWithEmail] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Only allow 10-digit numbers that start with 6,7,8, or 9
    if (/^[6-9]\d{0,9}$/.test(newValue) || newValue === "") {
      setPhoneNo(newValue);
    }
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function loginHandler() {
    try {
      if (loginWithEmail) {
        if (!emailRegex.test(email)) {
          toast.error("Please provide a valid email address.");
          return;
        }
      } else {
        if (phone.length !== 10) {
          toast.error("Mobile number must be 10 digits.");
          return;
        }
      }
      if (password.length < 8) {
        toast.error("Please provide valid password");
        return;
      }

      const body = loginWithEmail ? { email, password } : { phone, password };
      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include", // 🔥 critical to include cookies in request
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Login successfully!");
        localStorage.setItem("token", data.data);
        setPhoneNo("");
        setPassword("");
        navigate("/explore");
        await checkAuth(); // update context state
        await fetchProfile(); // update user profile context state
        await fetchConversations(); // update user conversations state
      } else {
        toast.error(data.message || "Login failed!");
      }
    } catch (err) {
      toast.error("An error occurred while Login.");
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-10 bg-white pt-4 px-3  ">
      {/* Back button */}
      <BackButton navigateTo="/signup" />

      {/* Heading */}
      <div className="w-11/12">
        <h1 className="text-3xl  poppins-bold ">Welcome Back</h1>
        <p className="text-sm text-gray-600 poppins-light pt-1">
          Access your account securely by using credentials
        </p>
      </div>

      {/* Form */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex flex-col gap-4 pt-2">
          {!loginWithEmail ? (
            <div className="relative">
              <img
                src="/svg/call.svg"
                alt="Call logo"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6"
              />
              <input
                type="tel"
                required
                min={10}
                maxLength={10}
                value={phone}
                onChange={handleChange}
                placeholder="Enter Phone number"
                className="bg-[#F4F4F4]  rounded-full h-14 w-full pl-12 pr-4 focus:outline-none focus:ring"
              />
            </div>
          ) : (
            <div className="relative">
              <img
                src="/svg/email.svg"
                alt="Call logo"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6"
              />
              <input
                type="text"
                required
                maxLength={40}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                className="bg-[#F4F4F4]  rounded-full h-14 w-full pl-12 pr-4 focus:outline-none focus:ring"
              />
            </div>
          )}

          <div className="relative">
            <img
              src="/svg/lock.svg"
              alt="Lock logo"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              min={8}
              maxLength={30}
              className="bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4 focus:outline-none focus:ring"
            />
            <img
              src={showPassword ? "/svg/eye-slash.svg" : "/svg/eye.svg"}
              alt="Toggle password visibility"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          <div className="flex  items-center justify-around gap-15 ">
            <div>
              <p
                className="text-sm inter-medium text-[#444]"
                onClick={() => {
                  if (loginWithEmail) {
                    setEmail("");
                  } else {
                    setPhoneNo("");
                  }
                  setLoginWithEmail((prev) => !prev);
                }}
              >
                Login with Email?
              </p>
            </div>
            <span className="text-[#B00000]">
              <Link to="/reset">Forgot password?</Link>
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col items-center">
        <div className="w-8/12 flex flex-col gap-4">
          <button
            type="submit"
            className=" text-white bg-[#0385C2] rounded-full h-12 cursor-pointer select-none  transform transition ease-in-out duration-300 hover:scale-95 active:scale-90"
            onClick={loginHandler}
          >
            <p className="poppins-semibold text-xl">Login</p>
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
            Don't have an account?{" "}
            <b className="font-bold">
              <Link to="/signup">Sign Up</Link>
            </b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
