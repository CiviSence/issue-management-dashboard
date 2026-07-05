import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import csmlogo from "../assets/logo/CSM-logo.png";
import { registerUser } from "../Utils/auth-api";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    userType: "staff", // 'staff' | 'admin' (default to staff)
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone_number: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email");
      return false;
    }
    if (!formData.userType) {
      setError("Please select a user type");
      return false;
    }
    // Phone number validation
    if (!/^\d{10}$/.test(formData.phone_number)) {
      setError("Phone number must contain exactly 10 digits");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Determine role based on userType

      const payload = {
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        password: formData.password,
        phone_number: formData.phone_number,
        intended_role: formData.userType, // This differentiates user types
      };

      const res = await registerUser(payload);

      localStorage.setItem("pendingVerificationEmail", formData.email);
      navigate("/verify-otp");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full flex min-h-screen"
        >
          {/* Left Side - Branding */}
          <div className="hidden md:flex w-1/2 rounded-r-4xl bg-linear-to-br from-[#7E70EB] to-[#5A50A6] p-16 flex-col justify-center text-white relative overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="bg-white p-4 rounded-2xl w-20 h-20 mb-10 shadow-2xl flex items-center justify-center">
                <img
                  src={csmlogo}
                  alt="CSM Logo"
                  className="w-12 h-12 object-contain"
                />
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Report. Track. <br />
                <span className="text-indigo-200">Resolve.</span>
              </h1>

              <p className="text-lg text-indigo-50/80 mb-12 max-w-md leading-relaxed">
                Join our unified platform to streamline campus issue management.
                We empower staff and administrators to build a more responsive
                community together.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: "ri-checkbox-circle-line",
                    text: "Seamless Issue Reporting",
                  },
                  {
                    icon: "ri-bar-chart-box-line",
                    text: "Real-time Status Tracking",
                  },
                  { icon: "ri-team-line", text: "Collaborative Resolution" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-4 text-indigo-50/90"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                      <i className={`${item.icon} text-xl`}></i>
                    </div>
                    <span className="font-medium text-lg">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
            <div className="max-w-md mx-auto w-full">
              {/* Mobile Logo */}
              <div className="md:hidden flex flex-col items-center mb-8">
                <div className="w-16 h-16 p-3 bg-violet-50 rounded-2xl mb-3">
                  <img
                    src={csmlogo}
                    alt="CSM"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Civisence-Admin</h2>
              </div>

              <h1 className="text-3xl font-bold text-[#6366f1] mb-2 text-center md:text-left">
                Sign up
              </h1>
              <p className="text-gray-500 mb-8 text-center md:text-left text-sm">
                Create your account to start managing issues.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 text-sm flex items-center gap-3">
                  <i className="ri-error-warning-line text-lg"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Type Selection */}
                <div className="space-y-1">
                  <div className="grid grid-cols-2 gap-2">
                    {["staff", "admin"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        name="userType"
                        value={type}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, userType: type }))
                        }
                        className={`py-2 px-3 rounded-lg border text-sm font-medium capitalize transition-all ${formData.userType === type
                            ? "bg-[#7E70EB] text-white border-[#7E70EB]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-[#7E70EB] hover:text-[#7E70EB]"
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 ml-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 ml-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 ml-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 outline-none transition-all text-sm"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 ml-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone_number"
                    placeholder={"1234567890"}
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 outline-none transition-all text-sm"
                  />
                </div>

                {/* Password Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 ml-1">
                      Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 ml-1">
                      Confirm password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Show Password Checkbox */}
                <div className="flex items-center">
                  <input
                    id="show-password"
                    type="checkbox"
                    className="w-4 h-4 text-[#6366f1] border-gray-300 rounded focus:ring-[#6366f1]"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                  />
                  <label
                    htmlFor="show-password"
                    className="ml-2 text-xs text-gray-500"
                  >
                    Show password
                  </label>
                </div>

                {/* Terms Text */}
                <p className="text-[10px] text-gray-500 text-center px-4">
                  by continuing, you agree to the{" "}
                  <Link to="/terms" className="underline hover:text-[#6e5fdb]">
                    Terms of use
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" className="underline hover:text-[#6e5fdb]">
                    Privacy Policy
                  </Link>
                </p>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#7E70EB] hover:bg-[#5A50A6] disabled:bg-gray-400 text-white font-medium py-3 rounded-full shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none flex items-center justify-center"
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Sign up"
                  )}
                </button>

                {/* Sign In Link */}
                <p className="text-center text-sm text-gray-500 mt-6">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-[#6366f1] font-semibold hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
