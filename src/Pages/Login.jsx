import React, { useState } from "react";
import {  Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import csmlogo from "../assets/logo/CSM-logo.png";
import { loginUser } from "../Utils/auth-api";
import { setSession } from "../Utils/auth-utils";

import { useUser } from "../Context/ProfileContext";



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setProfileData } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });
      console.log(data);

      // Store tokens and user data
      setSession(data.access_token, data.user, data.refresh_token);
      setProfileData(data.user);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);

      // Specifically handle unverified email case (403)
      if (err.message.includes("verify your email") || err.message.includes("verification")) {
        localStorage.setItem("pendingVerificationEmail", email);
        navigate("/verify-otp");
        return;
      }

      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f0ff] flex flex-col">


      {/* Main Content */}
      <div className="flex-1 flex">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full flex min-h-screen"
        >
          {/* Left Side - Branding */}
          <div className="hidden md:flex w-1/2 bg-linear-to-br from-[#7E70EB] to-[#5A50A6] p-16 flex-col justify-center text-white relative overflow-hidden">
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
                <img src={csmlogo} alt="CSM Logo" className="w-12 h-12 object-contain" />
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Report. Track. <br />
                <span className="text-indigo-200">Resolve.</span>
              </h1>
              
              <p className="text-lg text-indigo-50/80 mb-12 max-w-md leading-relaxed">
                Join our unified platform to streamline campus issue management. We empower staff and administrators to build a more responsive community together.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: "ri-checkbox-circle-line", text: "Seamless Issue Reporting" },
                  { icon: "ri-bar-chart-box-line", text: "Real-time Status Tracking" },
                  { icon: "ri-team-line", text: "Collaborative Resolution" }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (i * 0.1) }}
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

          {/* Right Side - Login Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
            <div className="max-w-md mx-auto w-full">
              {/* Mobile Logo */}
              <div className="md:hidden flex flex-col items-center mb-8">
                <div className="w-16 h-16 p-3 bg-violet-50 rounded-2xl mb-3">
                  <img src={csmlogo} alt="CSM" className="w-full h-full object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">CSM Portal</h2>
              </div>

              <h1 className="text-3xl font-bold text-[#6366f1] mb-2 text-center md:text-left">
                Sign in
              </h1>
              <p className="text-gray-500 mb-8 text-center md:text-left text-sm">Welcome back! Please enter your details.</p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 text-sm flex items-center gap-3 text-center md:text-left">
                  <i className="ri-error-warning-line text-lg"></i>
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleLogin}>
                {/* Email/Username Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-500 ml-1">
                    Email / Registration no. / username
                  </label>
                  <input
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-opacity-20 focus:border-[#6366f1] transition-all text-sm shadow-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-medium text-gray-500">Your Password</label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-[#6366f1] font-semibold flex items-center hover:text-[#5445c9] transition-colors"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:ring-opacity-20 focus:border-[#6366f1] transition-all text-sm shadow-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex justify-between items-center text-xs pt-1">
                  <label className="flex items-center text-gray-500 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="mr-2 w-4 h-4 border-gray-300 rounded text-[#6366f1] focus:ring-[#6366f1]"
                    />
                    <span className="group-hover:text-gray-700 transition-colors font-medium">Remember me</span>
                  </label>
                  <Link
                    to={"/forgot-password"}
                    className="text-[#6366f1] font-semibold hover:text-[#5445c9] hover:underline transition-colors"
                  >
                    Forget password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#6e5fdb] hover:bg-[#5445c9] text-white py-3 rounded-full font-bold text-lg shadow-lg shadow-indigo-500/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center disabled:bg-gray-400 disabled:transform-none"
                >
                  {loading ? (
                    <i className="ri-loader-4-line animate-spin text-xl"></i>
                  ) : (
                    "Sign in"
                  )}
                </button>

                {/* Terms and Links */}
                <div className="space-y-4 pt-4">
                  <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                    By signing in, you agree to our{" "}
                    <Link to="/terms" className="text-gray-600 hover:text-[#6366f1] underline">Terms of service</Link>
                    {" "}and{" "}
                    <Link to="/privacy-policy" className="text-gray-600 hover:text-[#6366f1] underline">Privacy Policy</Link>.
                  </p>

                  <p className="text-sm text-gray-500 text-center">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-[#6366f1] font-bold hover:underline"
                    >
                      Sign up for free
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
