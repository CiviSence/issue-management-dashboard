import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import csmlogo from "../assets/logo/CSM-logo.png";
import { loginUser } from "../Utils/auth-api";
import { setSession } from "../Utils/auth-utils";
import { motion } from "framer-motion";
import { useUser } from "../Context/ProfileContext";
import SEO from "../Components/common/SEO";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const navigate = useNavigate();
  const { setProfileData } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser({ email, password });

      // Store tokens and user data
      setSession(data.access_token, data.user, data.refresh_token);
      setProfileData(data.user);

      // Navigate based on user role
      if (data.user.role === "admin") {
        navigate("/");
      } else if (data.user.role === "staff") {
        navigate("/assigned-issues");
      } else {
        navigate("/issue-feed");
      }
    } catch (err) {
      console.error("Login Failed:", err);
      if (err.status === 429) {
        const retry = err.retryAfter || 60;
        setCooldown(retry);
        setError(`Too many attempts. Please try again in ${retry} seconds`);
        return;
      }

      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] w-full flex flex-col">
      <SEO
        title="Admin and Staff Login"
        description="Sign in to civisence admin and staff portal to manage civic issues, track maintenance status, and participate in collaborative campus governance."
        keywords="admin login, staff login, civisence sign in, university issue tracker login, admin portal, staff portal, facility reporting login"
      />
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full flex min-h-screen"
        >
          {/* Left Side - Branding */}
          <div className="hidden  md:flex rounded-r-4xl w-1/2 bg-linear-to-br from-[#7E70EB] to-[#5A50A6] p-16 flex-col justify-center text-white relative overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="bg-white p-2 rounded-2xl w-15 h-15 mb-10 shadow-2xl flex items-center justify-center">
                <img src={csmlogo} alt="CiviSence Logo" className="object-contain" />
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Report. Track. <br />
                <span className="text-indigo-200">Resolve.</span>
              </h1>

              <p className="text-lg text-indigo-50/80 mb-12 max-w-md leading-relaxed">
                Empower administrators and staff to manage, prioritize, assign,
                and resolve campus issues through a centralized dashboard with
                real-time updates and collaboration.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: "ri-checkbox-circle-line",
                    text: "Transparent Progress",
                  },
                  {
                    icon: "ri-bar-chart-box-line",
                    text: "Live Monitoring & Analytics",
                  },
                  { icon: "ri-team-line", text: "Faster Issue Resolution" },
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

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="w-full md:w-1/2 p-5 md:p-12 flex flex-col justify-center relative"
          >
            <div className="max-w-md mx-auto w-full">
              {/* Mobile Logo */}
              <div className="md:hidden flex flex-col items-center mb-8">
                <div className="w-16 h-16 p-2 bg-white shadow-xs rounded-2xl mb-3">
                  <img
                    src={csmlogo}
                    alt="CiviSence"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <h1 className="mb-2 text-center md:text-left text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                Sign in
              </h1>
              <p className="text-gray-400 mb-8 text-center md:text-left text-xs font-medium">
                Welcome back! Please enter your details.
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-700 text-sm flex items-center gap-3 text-center md:text-left"
                >
                  <i className="ri-error-warning-line text-lg"></i>
                  {error}
                </motion.div>
              )}

              <form className="space-y-5" onSubmit={handleLogin}>
                {/* Email/Username Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 ml-1">
                    Email
                  </label>
                  <input
                    className="w-full bg-white placeholder:text-gray-300 text-sm font-medium text-gray-500 px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#6366f1]/20 outline-none transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-gray-400 ml-1">
                      Your Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-[#7274f1] font-semibold flex items-center "
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-white placeholder:text-gray-300 font-medium text-gray-500 px-4 py-2.5 rounded-lg border border-gray-200  focus:ring-2 focus:ring-[#6366f1]/20 outline-none transition-all text-sm"
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
                      className="mr-2 w-4 h-4 bg-white"
                    />
                    <span className="group-hover:text-gray-700 transition-colors font-medium">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to={"/forgot-password"}
                    className="text-[#7274f1] font-semibold hover:underline"
                  >
                    Forget password?
                  </Link>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading || cooldown > 0}
                  className="w-full bg-[#6e5fdb] hover:bg-[#5445c9] text-white py-3 rounded-full font-bold text-lg shadow-lg shadow-indigo-500/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center disabled:bg-gray-400 disabled:transform-none"
                >
                  {cooldown > 0 ? (
                    `Try again in ${cooldown}s`
                  ) : loading ? (
                    <i className="ri-loader-4-line animate-spin text-xl"></i>
                  ) : (
                    "Sign in"
                  )}
                </button>

                <div className="space-y-4 pt-4">
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-[#6366f1] font-bold hover:underline"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
