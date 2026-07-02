import { useState } from "react";
import { useUser } from "../../../Context/ProfileContext";
import { Link, NavLink } from "react-router-dom";
import defaultProfile from "../../../assets/default-avatar.jpg";
import csmLogo from "../../../assets/logo/logowhite.png";

export const NavItem = ({ to, icon, label }) => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center justify-center lg:justify-start
     rounded-lg px-4 py-3 transition
     ${
       isActive
         ? "bg-white/95 text-[#6366f1] shadow-lg font-bold"
         : "text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm"
     }`;

  return (
    <NavLink to={to} className={navLinkClass}>
      <i className={`${icon} text-xl`}></i>
      <span className="hidden lg:inline ml-3">{label}</span>
    </NavLink>
  );
};

import { clearSession } from "../../../Utils/auth-utils";
import {
  logoutUser as logoutUserApi,
  logoutAllSessions,
} from "../../../Utils/auth-api";

const SideNavLayout = ({ children }) => {
  const { profileData } = useUser();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutInput, setLogoutInput] = useState("");
  const [logoutType, setLogoutType] = useState("current"); // "current" | "all"
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    if (logoutInput.toLowerCase() !== "logout") return;

    setIsLoggingOut(true);
    try {
      if (logoutType === "all") {
        await logoutAllSessions();
      } else {
        await logoutUserApi();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      clearSession();
      window.location.href = "/";
    }
  };

  return (
    <div
      className="bg-linear-to-br from-[#7E70EB] to-[#5A50A6]
        hidden md:flex flex-col justify-between
        w-20 lg:w-[17vw]
        shrink-0
        h-screen overflow-x-visible relative z-40
        p-3 lg:p-3 xl:p-5
        text-white"
    >
      <div className="w-full flex flex-col items-center lg:items-start mt-3">
        {/* Logo */}
          <Link to="/" className="flex items-center gap-1">
            <img src={csmLogo} alt="CSM Logo" className="h-10 lg:h-12 w-auto object-contain" />
            <span className="hidden lg:inline text-sm  lg:text-xl xl:text-2xl font-semibold">
              CiviSence
            </span>
          </Link>
        {/* Main Nav */}
        <nav className="flex flex-col gap-4 pt-8 w-full">{children}</nav>
      </div>

      <div className="relative mt-auto">
        {/* Legal Links Footer */}
        <div className="hidden lg:flex px-2 mb-4 space-x-3 text-[10px] font-medium text-indigo-200">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span>&bull;</span>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
        </div>
        {/* Profile button */}
        <div
          onMouseEnter={() => setShowProfileMenu((prev) => !prev)}
          className="flex items-center justify-center lg:justify-start gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-white/10 backdrop-blur-sm transition-all border border-transparent hover:border-white/20"
        >
          <div className="h-10 w-10 rounded-full  shrink-0 flex items-center justify-center">
            <img
              src={profileData?.avatar_url || defaultProfile}
              alt="Profile"
              className="h-9 w-9 rounded-full border border-black object-cover"
            />
          </div>

          <div className="hidden lg:block">
            <p className="text-s font-medium truncate max-w-35">
              {profileData?.name}
            </p>
            <p className="text-sm text-indigo-100/80 font-medium">
              {profileData?.role || "user"}
            </p>
          </div>
        </div>

        {/* Dropdown */}
        {showProfileMenu && (
          <div className="absolute bottom-14 left-0 w-64 bg-white text-[#2f2f2f] rounded-xl shadow-xl p-2 z-50">
            {/* Header */}
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-10 w-10 rounded-full shrink-0 flex items-center justify-center">
                <img
                  src={profileData?.avatar_url || defaultProfile}
                  alt="Profile"
                  className="h-9 w-9 rounded-full border object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium">{profileData?.name}</p>
                <p className="text-xs text-gray-400">{profileData?.email}</p>
              </div>
            </div>

            <hr className="my-2 border-gray-300" />

            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/20 text-sm text-red-400"
            >
              <i className="ri-logout-box-r-line text-xl"></i> Log out
            </button>
          </div>
        )}
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
              Confirm Logout
            </h3>

            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors has-checked:border-violet-600 has-checked:bg-violet-50">
                <input
                  type="radio"
                  name="logoutType"
                  value="current"
                  checked={logoutType === "current"}
                  onChange={(e) => setLogoutType(e.target.value)}
                  className="w-4 h-4 text-violet-600 focus:ring-violet-500"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 shadow-none">
                    This device only
                  </p>
                  <p className="text-xs text-gray-500 shadow-none">
                    Logout from your current session
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors has-checked:border-red-600 has-checked:bg-red-50">
                <input
                  type="radio"
                  name="logoutType"
                  value="all"
                  checked={logoutType === "all"}
                  onChange={(e) => setLogoutType(e.target.value)}
                  className="w-4 h-4 text-red-600 focus:ring-red-500"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold  shadow-none text-red-600">
                    All devices
                  </p>
                  <p className="text-xs text-gray-500 shadow-none">
                    Logout across all active sessions
                  </p>
                </div>
              </label>
            </div>

            <p className="mb-2 text-sm text-gray-600 text-center">
              Type <span className="font-bold text-red-500">logout</span> to
              confirm.
            </p>
            <input
              type="text"
              value={logoutInput}
              onChange={(e) => setLogoutInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 mb-6 text-center outline-none focus:border-violet-600 transition-all font-medium text-red-500"
              placeholder="Confirm logout"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  setLogoutInput("");
                  setLogoutType("current");
                }}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                disabled={
                  logoutInput.toLowerCase() !== "logout" || isLoggingOut
                }
                className="flex-1 px-4 py-2.5 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-500/30"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideNavLayout;
