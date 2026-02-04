import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { verifyEmail, resendOtp } from "../Utils/auth-api";
import { setSession } from "../Utils/auth-utils";

const Verify = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const email = localStorage.getItem("pendingVerificationEmail");

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f0ff]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Session expired. Please sign up again.
          </p>
          <Link
            to="/signup"
            className="text-[#6366f1] font-semibold hover:underline"
          >
            Go to Signup
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await verifyEmail({ email, otp });
      console.log(res);

      // Clear pending email
      localStorage.removeItem("pendingVerificationEmail");

      // Store auth token if provided
      if (res.token) {
        setSession(res.token, res.user); // Assuming res.user checks out, otherwise just token
      } else if (res.access_token) {
        setSession(res.access_token, res.user);
      }

      // Redirect to login or dashboard
      navigate("/login");
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp({ email });
      alert("New OTP sent to your email!");
    } catch (err) {
      setError("Failed to resend OTP. Please try again.",err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f0ff] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#6366f1] mb-2 text-center">
          Verify OTP
        </h1>
        <p className="text-gray-500 text-center mb-8 text-sm">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-gray-700">{email}</span>
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 ml-1">
              OTP Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              placeholder="000000"
              required
              className="w-full px-4 py-3 text-center text-2xl tracking-widest rounded-lg border border-gray-200 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full bg-[#6366f1] hover:bg-[#4f46e5] disabled:bg-gray-400 text-white font-medium py-3 rounded-full shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <button
            onClick={handleResendOtp}
            className="text-sm text-[#6366f1] hover:underline font-medium"
          >
            Resend OTP
          </button>
          <p className="text-xs text-gray-400">OTP valid for 10 minutes</p>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/signup"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Verify;
