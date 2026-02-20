import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { registerUser } from "../Utils/auth-api";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Add userType to form state
  const [formData, setFormData] = useState({
    userType: "", // 'student' | 'staff' | 'admin'
    firstName: "",
    lastName: "",
    email: "",
    registration_number: "",
    designation: "",
    password: "",
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
    // Only validate registration number for students
    if (
      formData.userType === "student" &&
      !formData.registration_number.trim()
    ) {
      setError("Registration number is required for students");
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
        // Only include registration_number for students, null for others to avoid UNIQUE constraint collisions
        registration_number:
          formData.userType === "student" ? formData.registration_number : null,
        gender: "prefer_not_to_say",
        date_of_birth: "2000-01-01",
        phone_number: null, // Set to null to avoid unique constraint collisions with default '0000000000'
        pincode: null,
        department: "General",
        course: formData.userType === "student" ? "Btech" : "N/A",
        year: formData.userType === "student" ? 1 : 0,
        semester: formData.userType === "student" ? 1 : 0,
        role: formData.userType, // This differentiates user types
        designation:
          formData.userType === "student"
            ? "Student"
            : formData.designation,
        is_hosteler: false,
        hostel_name: "N/A",
        room_number: "000",
      };

      console.log("Registration payload:", payload);

      const res = await registerUser(payload);
      console.log(res);

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
    <div className="min-h-screen w-full bg-[#f3f0ff] flex flex-col">
      {/* Back Button */}
      <div className="p-6">
        <Link
          to="/"
          className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-sm">Back</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden flex min-h-500px"
        >
          {/* Left Side - Illustration */}
          <div className="hidden md:flex w-1/2 bg-linear-to-b from-[#7E70EB] to-[#5A50A6] p-12 flex-col items-center justify-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white"></div>
              <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-white"></div>
            </div>

            <h3 className="text-3xl font-semibold mb-8 relative z-10">
              Create an Account
            </h3>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 w-64 h-64 flex items-center justify-center relative z-10 border border-white/20">
              <div className="text-center">
                <svg
                  className="w-20 h-20 mx-auto text-white/80 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                <p className="text-white/80 text-sm">
                  Join our community today
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
            <div className="max-w-md mx-auto w-full">
              <h1 className="text-3xl font-bold text-[#6366f1] mb-8 text-center">
                Sign up
              </h1>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* User Type Selection */}
                <div className="space-y-1">
                  <div className="grid grid-cols-3 gap-2">
                    {["student", "staff", "admin"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        name="userType"
                        value={type}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, userType: type }))
                        }
                        className={`py-2 px-3 rounded-lg border text-sm font-medium capitalize transition-all ${formData.userType === type
                          ? "bg-[#6366f1] text-white border-[#6366f1]"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#6366f1] hover:text-[#6366f1]"
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

                {/* Conditional Registration Number - Only for Students */}
                {formData.userType === "student" && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 ml-1">
                      University Registration number
                    </label>
                    <input
                      type="text"
                      name="registration_number"
                      value={formData.registration_number}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 outline-none transition-all text-sm"
                    />
                  </div>
                )}

                {/* Conditional Designation - for Staff/Admin */}
                {(formData.userType === "staff" || formData.userType === "admin") && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 ml-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 outline-none transition-all text-sm"
                    />
                  </div>
                )}

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
                  <a href="#" className="underline hover:text-[#6366f1]">
                    Terms of use
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline hover:text-[#6366f1]">
                    Privacy Policy
                  </a>
                </p>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#6366f1] hover:bg-[#4f46e5] disabled:bg-gray-400 text-white font-medium py-3 rounded-full shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none flex items-center justify-center"
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
