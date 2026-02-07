import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//i used a trick to disable the unused variable warning for motion but without it it womt wotk properly
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import LoginSVG from "../assets/login.svg";
import { loginUser } from "../Utils/auth-api";
import { setSession } from "../Utils/auth-utils";

import { useUser } from "../Context/ProfileContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // when login button is clicked it shows loading state

  const navigate = useNavigate();
  const { setProfileData } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      console.log(data);

      setSession(data.access_token, data.user);

      // Update global context state immediately
      if (setProfileData) {
        setProfileData(data.user);
      }

      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f0ff] flex flex-col">
      {/* Back Button */}
      <div className="p-6">
        <Link
          to="/"
          className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <i className="ri-arrow-left-s-line"></i>
          <span className="text-sm">Back</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden flex min-h-500px"
        >
          {/* Left Side - Sign In Form */}
          <div className="w-full md:w-1/2 p-15 flex flex-col justify-center">
            <h2 className="text-3xl font-semibold text-[#7c6bff] text-center mb-8">
              Sign in
            </h2>

            <form className="space-y-5" onSubmit={handleLogin}>
              {/* Email/Username Input */}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  Email / Registration no. / username
                </label>
                <input
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c6bff] focus:border-transparent transition-all text-sm"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs text-gray-500">Your Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-gray-400 flex items-center hover:text-gray-600 transition-colors"
                  >
                    {/* <svg
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
                    {showPassword ? "Hide" : "Show"} */}
                  </button>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c6bff] focus:border-transparent transition-all text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex justify-between items-center text-xs">
                <label className="flex items-center text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2 w-3.5 h-3.5 border-gray-300 rounded text-[#7c6bff] focus:ring-[#7c6bff]"
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  className="text-gray-500 hover:text-[#7c6bff] underline transition-colors"
                >
                  Forget password
                </a>
              </div>

              {/* Terms */}
              <p className="text-xs text-gray-400 text-center">
                by continuing, you agree to the{" "}
                <a
                  href="#"
                  className="underline hover:text-[#7c6bff] transition-colors"
                >
                  Terms of use
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="underline hover:text-[#7c6bff] transition-colors"
                >
                  Privacy Policy
                </a>
              </p>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              {/* Sign In Button */}
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
                  "Sign in"
                )}
              </button>

              {/* Sign Up Link */}
              <p className="text-sm text-gray-500 text-center">
                don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-gray-700 font-medium underline hover:text-[#7c6bff] transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>

          {/* Right Side - Welcome Back */}
          <div className="hidden md:flex w-1/2 bg-linear-to-b from-[#7E70EB] to-[#5A50A6] p-12  flex-col items-center justify-center text-white relative overflow-hidden">
            <h3 className="text-3xl font-semibold mb-8 relative z-10">
              Welcome Back
            </h3>

          
            <div className="bg-white rounded-2xl p-6 w-64 h-64 flex items-center justify-center relative z-10 shadow-xl">
              <div className="text-center">
                <img src={LoginSVG} alt="" />
                <p className="text-xs text-gray-400 mt-2"></p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
