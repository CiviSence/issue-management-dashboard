import { useEffect, useState } from "react";
import { useUser } from "../../Context/ProfileContext";
import { Link, NavLink } from "react-router-dom";
import { clearSession } from "../../Utils/auth-utils";
import { logoutUser as logoutUserApi } from "../../Utils/auth-api";

const SideNav = () => {
  const { profileData } = useUser();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutInput, setLogoutInput] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    if (logoutInput.toLowerCase() !== "logout") return;

    try {
      await logoutUserApi();
    } catch (error) {
      console.error("error:", error);
    } finally {
      clearSession();
      window.location.href = "/";
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center justify-center lg:justify-start
     rounded-lg px-4 py-3 transition
     ${
       isActive
         ? "bg-white text-violet-500 font-semibold"
         : "hover:text-white hover:bg-violet-400"
     }`;

  return (
    <div
      className=" bg-violet-500
        hidden md:flex flex-col justify-between
        w-20 lg:w-[17vw]
        shrink-0
        h-screen overflow-x-visible  relative z-40
        p-3 lg:p-5 xl:p-8
        text-white
      
      "
    >
      <div className="w-full flex flex-col items-center lg:items-start">
        {/* Logo */}
        <h1 className="text-xl font-bold flex items-center">
          <Link to="/" className="hidden lg:inline text-2xl ml-2">
            Issue Dashboard
          </Link>
        </h1>
        {/* Main Nav */}
        <nav className="flex flex-col gap-4 pt-10 w-full">
          <NavLink to="/dashboard" className={navLinkClass}>
            <i className="ri-dashboard-fill text-xl"></i>
            <span className="hidden lg:inline ml-3">Dashboard</span>
          </NavLink>

          <NavLink to="/reported-issues" className={navLinkClass}>
            <i className="ri-alarm-warning-fill text-xl"></i>
            <span className="hidden lg:inline ml-3">Reported Issues</span>
          </NavLink>

          <NavLink to="/resolved-issues" className={navLinkClass}>
            <i className="ri-shield-check-fill text-xl"></i>
            <span className="hidden lg:inline ml-3">Resolved Issues</span>
          </NavLink>

          <NavLink to="/leaderboard" className={navLinkClass}>
            <i className="ri-award-fill text-xl"></i>
            <span className="hidden lg:inline ml-3">Leaderboard</span>
          </NavLink>
          <NavLink to="/profile" className={navLinkClass}>
            <i className="ri-user-fill text-xl"></i>
            <span className="hidden lg:inline ml-3">Profile</span>
          </NavLink>
        </nav>
      </div>
      <div className="relative">
        {/* Profile button */}
        <div
         onMouseEnter={() => setShowProfileMenu((prev) => !prev)}
         
          className="flex items-center justify-center lg:justify-start gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-violet-400 transition"
        >
          <div className=" h-10 w-10 rounded-full bg-violet-600 shrink-0 flex items-center justify-center">
            <img
              src={profileData?.avatar_url || "/default-avatar.png"}
              alt="Profile"
              className="h-9 w-9 rounded-full border border-violet-500 object-cover"
            />
          </div>

          <div className="hidden lg:block">
            <p className="text-s font-medium truncate max-w-[140px]">
              {profileData?.name}
            </p>
            <p className="text-sm text-violet-200">
              {profileData?.role || "user"}
            </p>
          </div>
        </div>

        {/* Dropdown */}
        {showProfileMenu && (
          <div className="z-[9999] absolute bottom-14 left-0 w-64 bg-white text-[#2f2f2f] rounded-xl shadow-xl p-2 z-50">
            {/* Header */}
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-10 w-10 rounded-full  shrink-0 flex items-center justify-center">
                <img
                  src={profileData?.avatar_url || "/default-avatar.png"}
                  alt="Profile"
                  className="h-9 w-9 rounded-full border  object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium">{profileData?.name}</p>
                <p className="text-xs text-gray-400">
                  {profileData?.email || "user"}
                </p>
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
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Confirm Logout
            </h3>
            <p className="mb-4 text-gray-600">
              Type "logout" below to confirm.
            </p>
            <input
              type="text"
              value={logoutInput}
              onChange={(e) => setLogoutInput(e.target.value)}
              className="w-full border text-red-400 border-gray-300 rounded px-3 py-2 mb-4 outline-none focus:border-violet-500"
              placeholder="Type 'logout'"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  setLogoutInput("");
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                disabled={logoutInput.toLowerCase() !== "logout"}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideNav;
