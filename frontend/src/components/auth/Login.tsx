import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../utils/context/AuthContext";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "../../features/auth/authSlice";
import BackButton from "../Buttons/BackButton";
import { useConversation } from "../../utils/context/CoversationContext";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const { fetchConversations } = useConversation();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginWithEmail, setLoginWithEmail] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^[6-9]\d{0,9}$/.test(newValue) || newValue === "") {
      setPhoneNo(newValue);
    }
  };

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
        toast.error("Please provide a valid password");
        return;
      }

      const body = loginWithEmail ? { email, password } : { phone, password };

      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Login successful!");
        await checkAuth();
        dispatch(setAuthenticated());
        await fetchConversations();

        navigate("/explore");
      } else {
        toast.error(data.message || "Login failed!");
      }
    } catch {
      toast.error("An error occurred while Login.");
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col gap-10 bg-white pt-4 px-3 sm:px-6 md:px-10 pb-10">
      {/* Header + BackButton */}
      <div className="w-full max-w-md mx-auto flex flex-col gap-2">
        <BackButton navigateTo="/" />
        <h1 className="text-3xl poppins-bold">Welcome Back</h1>
        <p className="text-sm text-gray-600 poppins-light pt-1 mb-6">
          Access your account securely using your credentials
        </p>
      </div>

      {/* Form Inputs */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-md mx-auto flex flex-col gap-4">
          {/* Phone or Email */}
          {!loginWithEmail ? (
            <div className="relative">
              <img
                src="/svg/call.svg"
                alt="Call"
                className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6"
              />
              <input
                type="tel"
                value={phone}
                onChange={handleChange}
                placeholder="Enter Phone number"
                maxLength={10}
                className="bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4 focus:outline-none"
              />
            </div>
          ) : (
            <div className="relative">
              <img
                src="/svg/email.svg"
                alt="Email"
                className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6"
              />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                maxLength={40}
                className="bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4 focus:outline-none"
              />
            </div>
          )}

          {/* PASSWORD */}
          <div className="relative">
            <img
              src="/svg/lock.svg"
              alt="Lock"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4 focus:outline-none"
            />
            <img
              src={showPassword ? "/svg/eye-slash.svg" : "/svg/eye.svg"}
              alt="Toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 cursor-pointer"
            />
          </div>

          {/* Switch + Forgot Row */}
          <div className="flex justify-between items-center w-full text-sm text-[#444]">
            <p
              className="cursor-pointer inter-medium"
              onClick={() => {
                setLoginWithEmail((prev) => !prev);
                setEmail("");
                setPhoneNo("");
              }}
            >
              Login with {loginWithEmail ? "Phone" : "Email"}?
            </p>

            <Link to="/reset" className="text-[#B00000]">
              Forgot password?
            </Link>
          </div>
        </div>
      </div>

      {/* Actions & Social Login */}
      <div className="w-full flex flex-col items-center mt-6">
        <div className="w-full max-w-md mx-auto flex flex-col gap-4">
          <button
            type="submit"
            onClick={loginHandler}
            className="text-white bg-[#0385C2] rounded-full h-12 w-full flex items-center justify-center hover:scale-95 active:scale-90 transition"
          >
            <p className="poppins-semibold text-xl">Login</p>
          </button>

          <p className="text-center text-sm text-gray-500 poppins-regular mt-2">
            Or continue with
          </p>

          <button className="bg-[#F8F8F8] rounded-full h-12 w-full flex items-center justify-center gap-3 hover:scale-95 active:scale-90 transition">
            <img src="/svg/google-icon.svg" alt="Google icon" className="h-6" />
            <span className="poppins-regular">Continue with Google</span>
          </button>

          <p className="text-center text-sm poppins-extralight mt-2">
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
