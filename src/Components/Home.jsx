import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      {/* Header Section */}
      <div className="text-center max-w-2xl mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          College Issue Management System
        </h1>
        <p className="text-slate-300 text-base md:text-lg">
          A simple and transparent platform to report, track, and resolve college issues efficiently.
          Stay informed, raise concerns, and make your Campus better — together.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-6 py-3 rounded-xl border border-indigo-500 text-indigo-400 font-medium hover:bg-indigo-500 hover:text-white transition"
        >
          Sign Up
        </Link>
      </div>

      {/* Footer Note */}
      <p className="mt-10 text-sm text-slate-400">
        Built for Institutes • Powered by transparency
      </p>
    </div>
  );
}
