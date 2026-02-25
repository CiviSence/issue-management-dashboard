import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import LoginSVG from "../assets/login.svg";
import { forgotPassword, resetPassword } from "../Utils/auth-api";

// ==========================================
// FORGOT PASSWORD PAGE (Request OTP)
// ==========================================
export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await forgotPassword({ email });
      setSuccess(true);
      // Navigate to reset page after 1.5 seconds
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f0ff] flex flex-col">
      {/* Back Button */}
      <div className="p-6">
        <Link
          to="/login"
          className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <i className="ri-arrow-left-s-line"></i>
          <span className="text-sm">Back</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden flex min-h-125"
        >
          <div className="w-full p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-semibold text-[#7c6bff] text-center mb-2">
              Forgot Password?
            </h2>
            <p className="text-sm text-gray-500 text-center mb-8">
              Enter your email and we'll send you an OTP to reset your password
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm text-center">
                OTP sent successfully! Redirecting...
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Input */}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Email address
                </label>
                <input
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c6bff] focus:border-transparent transition-all text-sm"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7c6bff] text-white py-3 rounded-full font-medium hover:bg-[#6b5ce7] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
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
                  "Send OTP"
                )}
              </button>

              {/* Back to Login */}
              <p className="text-sm text-gray-500 text-center">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="text-gray-700 font-medium underline hover:text-[#7c6bff] transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ==========================================
// RESET PASSWORD PAGE (Enter New Password)
// ==========================================
export const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [formData, setFormData] = useState({
    otp: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect if no email in state
  if (!email) {
    return (
      <div className="min-h-screen w-full bg-[#f3f0ff] flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              No email provided. Please start from the forgot password page.
            </p>
            <Link
              to="/forgot-password"
              className="bg-[#7c6bff] text-white px-6 py-2 rounded-full hover:bg-[#6b5ce7] transition-colors"
            >
              Go to Forgot Password
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.new_password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (formData.new_password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        email,
        otp: formData.otp,
        new_password: formData.new_password,
      });
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full bg-[#f3f0ff] flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-[#7c6bff] mb-2">
              Success!
            </h3>
            <p className="text-gray-600 mb-4">
              Your password has been reset successfully.
            </p>
            <p className="text-sm text-gray-400">Redirecting to login...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f3f0ff] flex flex-col">
      {/* Back Button */}
      <div className="p-6">
        <Link
          to="/forgot-password"
          className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <i className="ri-arrow-left-s-line"></i>
          <span className="text-sm">Back</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden flex min-h-125"
        >
          {/* Left Side - Form */}
          <div className="w-full  p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-semibold text-[#7c6bff] text-center mb-2">
              Reset Password
            </h2>
            <p className="text-sm text-gray-500 text-center mb-8">
              Enter the OTP sent to{" "}
              <span className="font-medium text-gray-700">{email}</span>
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* OTP Input */}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  OTP Code
                </label>
                <input
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c6bff] focus:border-transparent transition-all text-sm text-center tracking-widest"
                  type="text"
                  name="otp"
                  maxLength={6}
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="000000"
                  required
                />
              </div>

              {/* New Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-gray-500">New Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-gray-400 flex items-center hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-3.5 h-3.5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="new_password"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c6bff] focus:border-transparent transition-all text-sm"
                  value={formData.new_password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirm_password"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c6bff] focus:border-transparent transition-all text-sm"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7c6bff] text-white py-3 rounded-full font-medium hover:bg-[#6b5ce7] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
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
                  "Reset Password"
                )}
              </button>

              {/* Resend OTP */}
              <div className="flex justify-between items-center text-sm">
                <Link
                  to="/forgot-password"
                  className="text-gray-500 hover:text-[#7c6bff] hover:underline transition-colors"
                >
                  Resend OTP
                </Link>
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-[#7c6bff] hover:underline transition-colors"
                >
                  Back to login
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
