import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../utils/context/AuthContext";
import { useDispatch } from "react-redux";
import { setAuthenticated, setToken } from "../../features/auth/authSlice";
import BackButton from "../Buttons/BackButton";
import { saveToken } from "../../utils/tokenDB";
import { initNotifications } from "../../notifications";

const handleEnableNotifications = async () => {
  // Safari and Brave love this because it's a "User Gesture"
  await initNotifications();
};

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginWithEmail, setLoginWithEmail] = useState(false);

  const [errors, setErrors] = useState({
    phone: "",
    email: "",
    password: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^[6-9]\d{0,9}$/.test(newValue) || newValue === "") {
      setPhoneNo(newValue);
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  async function loginHandler() {
    let newErrors = { phone: "", email: "", password: "" };
    let isValid = true;

    // PHONE / EMAIL VALIDATION
    if (loginWithEmail) {
      if (!emailRegex.test(email)) {
        newErrors.email = "Please provide a valid email address.";
        isValid = false;
      }
    } else {
      if (phone.length !== 10) {
        newErrors.phone = "Mobile number must be 10 digits.";
        isValid = false;
      }
    }

    // PASSWORD VALIDATION
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    try {
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
        dispatch(setToken(data.data));
        saveToken(data.data);

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
      {/* Header */}
      <div className="w-full max-w-md mx-auto flex flex-col gap-2">
        <BackButton navigateTo="/" />
        <h1 className="text-3xl poppins-bold">Welcome Back</h1>
        <p className="text-sm text-gray-600 poppins-light pt-1 mb-6">
          Access your account securely using your credentials
        </p>
      </div>

      {/* FORM */}
      <form
        className="w-full flex flex-col items-center"
        onSubmit={(e) => {
          e.preventDefault();
          loginHandler();
        }}
      >
        <div className="w-full max-w-md mx-auto flex flex-col gap-4">
          {/* PHONE OR EMAIL */}
          {!loginWithEmail ? (
            <div className="relative flex flex-col">
              <label htmlFor="phone" className="sr-only">
                Phone Number
              </label>

              <img
                src="/svg/call.svg"
                alt=""
                aria-hidden="true"
                className="absolute left-4 top-8 -translate-y-1/2 h-6 w-6"
              />

              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={handleChange}
                placeholder="Enter Phone number"
                maxLength={10}
                className={`bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4
                  focus:outline-none focus:ring-2 ${
                    errors.phone ? "ring-red-500" : "ring-[#0385C2]"
                  }`}
              />

              {errors.phone && (
                <p className="text-red-600 text-xs pl-3 mt-1">{errors.phone}</p>
              )}
            </div>
          ) : (
            <div className="relative flex flex-col">
              <label htmlFor="email" className="sr-only">
                Email
              </label>

              <img
                src="/svg/email.svg"
                alt=""
                aria-hidden="true"
                className="absolute left-4 top-8 -translate-y-1/2 h-6 w-6"
              />

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: "" }));
                }}
                placeholder="Enter Email"
                maxLength={40}
                className={`bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4
                  focus:outline-none focus:ring-2 ${
                    errors.email ? "ring-red-500" : "ring-[#0385C2]"
                  }`}
              />

              {errors.email && (
                <p className="text-red-600 text-xs pl-3 mt-1">{errors.email}</p>
              )}
            </div>
          )}

          {/* PASSWORD */}
          <div className="relative flex flex-col">
            <label htmlFor="password" className="sr-only">
              Password
            </label>

            <img
              src="/svg/lock.svg"
              alt=""
              aria-hidden="true"
              className="absolute left-4 top-8 -translate-y-1/2 h-6 w-6"
            />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              placeholder="Enter Password"
              className={`bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4
                focus:outline-none focus:ring-2 ${
                  errors.password ? "ring-red-500" : "ring-[#0385C2]"
                }`}
            />

            {/* Toggle password */}
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-8 -translate-y-1/2"
            >
              <img
                src={showPassword ? "/svg/eye-slash.svg" : "/svg/eye.svg"}
                alt=""
                aria-hidden="true"
                className="h-5 w-5"
              />
            </button>

            {errors.password && (
              <p className="text-red-600 text-xs pl-3 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* SWITCH */}
          <div className="flex justify-between items-center w-full text-sm text-[#444]">
            <button
              type="button"
              className="inter-medium "
              onClick={() => {
                setLoginWithEmail((prev) => !prev);
                setEmail("");
                setPhoneNo("");
                setErrors({ phone: "", email: "", password: "" });
              }}
            >
              Login with {loginWithEmail ? "Phone" : "Email"}?
            </button>

            <Link to="/reset" className="text-[#B00000] ">
              Forgot password?
            </Link>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="w-full max-w-md mx-auto flex flex-col gap-4 mt-6">
          <button
            type="submit"
            className="text-white bg-[#0385C2] rounded-full h-12 w-full flex items-center justify-center
              hover:scale-[0.97] active:scale-95 transition"
            onClick={handleEnableNotifications}
          >
            <p className="poppins-semibold text-xl">Login</p>
          </button>

          <p className="text-center text-sm text-gray-500 poppins-regular mt-2">
            Or continue with
          </p>

          <button
            type="button"
            className="bg-[#F8F8F8] rounded-full h-12 w-full flex items-center justify-center gap-3
              hover:scale-[0.97] active:scale-95 transition"
            onClick={() => toast("Feature coming soon...")}
          >
            <img src="/svg/google-icon.svg" alt="" className="h-6" />
            <span className="poppins-regular">Continue with Google</span>
          </button>

          <p className="text-center text-sm poppins-extralight mt-2">
            Don&apos;t have an account?{" "}
            <b className="font-bold">
              <Link to="/signup">Sign Up</Link>
            </b>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
