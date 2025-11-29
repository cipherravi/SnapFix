import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import BackButton from "../Buttons/BackButton";
import toast from "react-hot-toast";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^[6-9]\d{0,9}$/.test(newValue) || newValue === "") {
      setPhoneNo(newValue);
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  async function registerHandler() {
    let newErrors = {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    let valid = true;

    if (name.length < 8) {
      newErrors.name = "Full name must be at least 8 characters.";
      valid = false;
    }

    if (phone.length !== 10) {
      newErrors.phone = "Mobile number must be 10 digits.";
      valid = false;
    }

    if (!emailRegex.test(email)) {
      newErrors.email = "Please provide a valid email address.";
      valid = false;
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    try {
      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, phone, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Registered successfully!");
        navigate("/login");
      } else {
        toast.error(data.message || "Registration failed!");
      }
    } catch {
      toast.error("An error occurred while registering.");
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col gap-10 bg-white pt-4 px-3 sm:px-6 md:px-10 pb-10">
      {/* Header */}
      <div className="w-full max-w-md mx-auto flex flex-col gap-2">
        <BackButton navigateTo="/login" />
        <h1 className="text-3xl poppins-bold">Register Now</h1>
        <p className="text-sm text-gray-600 poppins-light pt-1 mb-6">
          Sign up with your valid details to continue
        </p>
      </div>

      {/* FORM - supports ENTER KEY */}
      <form
        className="w-full flex flex-col items-center"
        onSubmit={(e) => {
          e.preventDefault();
          registerHandler();
        }}
      >
        <div className="w-full max-w-md mx-auto flex flex-col gap-4">
          {/* FULL NAME */}
          <div className="relative flex flex-col">
            <label htmlFor="name" className="sr-only">
              Full Name
            </label>

            <img
              src="/svg/profile.svg"
              alt=""
              aria-hidden="true"
              className="absolute left-4 top-8 -translate-y-1/2 h-5 w-5"
            />

            <input
              id="name"
              type="text"
              placeholder="Enter Full Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={`bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4 
                focus:outline-none focus:ring-2 ${
                  errors.name ? "ring-red-500" : "ring-[#0385C2]"
                }`}
            />

            {errors.name && (
              <p className="text-red-600 text-xs pl-3 mt-1">{errors.name}</p>
            )}
          </div>

          {/* PHONE */}
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
              placeholder="Enter Phone number"
              value={phone}
              onChange={handleChange}
              className={`bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4 
                focus:outline-none focus:ring-2 ${
                  errors.phone ? "ring-red-500" : "ring-[#0385C2]"
                }`}
            />

            {errors.phone && (
              <p className="text-red-600 text-xs pl-3 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* EMAIL */}
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
              placeholder="Enter Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={`bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4 
                focus:outline-none focus:ring-2 ${
                  errors.email ? "ring-red-500" : "ring-[#0385C2]"
                }`}
            />

            {errors.email && (
              <p className="text-red-600 text-xs pl-3 mt-1">{errors.email}</p>
            )}
          </div>

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
              placeholder="Enter Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
              className={`bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4 
                focus:outline-none focus:ring-2 ${
                  errors.password ? "ring-red-500" : "ring-[#0385C2]"
                }`}
            />

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

          {/* CONFIRM PASSWORD */}
          <div className="relative flex flex-col">
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm Password
            </label>

            <img
              src="/svg/lock.svg"
              alt=""
              aria-hidden="true"
              className="absolute left-4 top-8 -translate-y-1/2 h-6 w-6"
            />

            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              className={`bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4 
                focus:outline-none focus:ring-2 ${
                  errors.confirmPassword ? "ring-red-500" : "ring-[#0385C2]"
                }`}
            />

            <button
              type="button"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-8 -translate-y-1/2"
            >
              <img
                src={
                  showConfirmPassword ? "/svg/eye-slash.svg" : "/svg/eye.svg"
                }
                alt=""
                aria-hidden="true"
                className="h-5 w-5"
              />
            </button>

            {errors.confirmPassword && (
              <p className="text-red-600 text-xs pl-3 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="w-full max-w-md mx-auto flex flex-col gap-4 mt-6">
          <button
            type="submit"
            className="text-white bg-[#0385C2] rounded-full h-12 w-full flex items-center justify-center hover:scale-95 active:scale-90 transition"
          >
            <p className="poppins-semibold text-xl">Sign up</p>
          </button>

          <p className="text-center text-sm text-gray-500 poppins-regular mt-2">
            Or continue with
          </p>

          <button
            type="button"
            className="bg-[#F8F8F8] rounded-full h-12 w-full flex items-center justify-center gap-3 hover:scale-95 active:scale-90 transition"
            onClick={() => toast("Feature coming soon...")}
          >
            <img src="/svg/google-icon.svg" alt="" className="h-6" />
            <span className="poppins-regular">Continue with Google</span>
          </button>

          <p className="text-center text-sm poppins-extralight mt-2">
            Already have an account?
            <b className="font-bold">
              <Link to="/login"> Sign In</Link>
            </b>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
