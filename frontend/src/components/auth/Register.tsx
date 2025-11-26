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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (/^[6-9]\d{0,9}$/.test(newValue) || newValue === "") {
      setPhoneNo(newValue);
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function registerHandler() {
    try {
      if (phone.length !== 10) {
        toast.error("Mobile number must be 10 digits.");
        return;
      }

      if (name.length < 8) {
        toast.error("Full name must be atleast 8 letters");
        return;
      }

      if (!emailRegex.test(email)) {
        toast.error("Please provide a valid email address.");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords must match.");
        return;
      }

      if (password.length < 8) {
        toast.error("Password must be at least 8 characters.");
        return;
      }

      const response = await fetch(`${VITE_API_BASE_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
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
      {/* Header + BackButton */}
      <div className="w-full max-w-md mx-auto flex flex-col gap-2">
        <BackButton navigateTo="/login" />
        <h1 className="text-3xl poppins-bold">Register Now</h1>
        <p className="text-sm text-gray-600 poppins-light pt-1 mb-6">
          Sign up with your valid details to continue
        </p>
      </div>

      {/* Form Inputs */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-md mx-auto flex flex-col gap-4">
          {/* FULL NAME */}
          <div className="relative">
            <img
              src="/svg/profile.svg"
              alt="Profile logo"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5"
            />
            <input
              type="text"
              placeholder="Enter Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4 focus:outline-none"
            />
          </div>

          {/* PHONE */}
          <div className="relative">
            <img
              src="/svg/call.svg"
              alt="Call logo"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6"
            />
            <input
              type="tel"
              placeholder="Enter Phone number"
              value={phone}
              onChange={handleChange}
              className="bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4 focus:outline-none"
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <img
              src="/svg/email.svg"
              alt="Email logo"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6"
            />
            <input
              type="text"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4 focus:outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <img
              src="/svg/lock.svg"
              alt="Lock logo"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4 focus:outline-none"
            />
            <img
              src={showPassword ? "/svg/eye-slash.svg" : "/svg/eye.svg"}
              alt="Toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 cursor-pointer"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <img
              src="/svg/lock.svg"
              alt="Lock logo"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6"
            />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-[#F4F4F4] rounded-full h-14 w-full pl-12 pr-4 focus:outline-none"
            />
            <img
              src={showConfirmPassword ? "/svg/eye-slash.svg" : "/svg/eye.svg"}
              alt="Toggle password visibility"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Actions & Social Login */}
      <div className="w-full flex flex-col items-center mt-6">
        <div className="w-full max-w-md mx-auto flex flex-col gap-4">
          <button
            className="text-white bg-[#0385C2] rounded-full h-12 w-full flex items-center justify-center hover:scale-95 active:scale-90 transition"
            onClick={registerHandler}
          >
            <p className="poppins-semibold text-xl">Sign up</p>
          </button>

          <p className="text-center text-sm text-gray-500 poppins-regular mt-2">
            Or continue with
          </p>

          <button className="bg-[#F8F8F8] rounded-full h-12 w-full flex items-center justify-center gap-3 hover:scale-95 active:scale-90 transition">
            <img src="/svg/google-icon.svg" alt="Google icon" className="h-6" />
            <span className="poppins-regular">Continue with Google</span>
          </button>

          <p className="text-center text-sm poppins-extralight mt-2">
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
