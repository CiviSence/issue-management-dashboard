import { NavLink } from "react-router-dom";
import { useUser } from "../../Context/ProfileContext";

const BottomNav = () => {
  const { profileData } = useUser();
  const role = profileData?.role?.toLowerCase();

  const navClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1
     ${isActive ? "text-white scale-110 shadow-sm" : "text-indigo-100/60 transition-all hover:text-white"}`;

  return (
    <div
      className="
        fixed bottom-0 left-0
        w-full
        h-16
       bg-linear-to-r from-[#7E70EB] to-[#5A50A6]
        rounded-t-3xl
        flex justify-around items-center
        md:hidden
        z-50
      "
    >
      <NavLink to="/dashboard" className={navClass}>
        <i className="ri-dashboard-fill text-xl"></i>
        <span className="text-xs">Dashboard</span>
      </NavLink>

      {/* ADMIN LINKS */}
      {(role === "admin" || role === "institute") && (
        <>
          <NavLink to="/reported-issues" className={navClass}>
            <i className="ri-alarm-warning-fill text-xl"></i>
            <span className="text-xs">Issues</span>
          </NavLink>
          <NavLink to="/admin-panel" className={navClass}>
            <i className="ri-terminal-window-fill text-xl"></i>

            <span className="text-xs">Panel</span>
          </NavLink>
        </>
      )}

      {/* STAFF LINKS */}
      {role === "staff" && (
        <>
          <NavLink to="/assigned-issues" className={navClass}>
            <i className="ri-task-fill text-xl"></i>
            <span className="text-xs">Tasks</span>
          </NavLink>

          <NavLink to="/help-support" className={navClass}>
            <i className="ri-customer-service-2-fill text-xl"></i>
            <span className="text-xs">Help</span>
          </NavLink>
        </>
      )}

      {/* STUDENT LINKS */}
      {role === "student" && (
        <>
          <NavLink to="/feed" className={navClass}>
            <i className="ri-rss-fill text-xl"></i>{" "}
            <span className="text-xs">Feed</span>
          </NavLink>
          <NavLink to="/help-support" className={navClass}>
            <i className="ri-customer-service-2-fill text-xl"></i>{" "}
            <span className="text-xs">Help</span>
          </NavLink>
        </>
      )}

      <NavLink to="/profile" className={navClass}>
        <i className="ri-user-fill text-xl"></i>
        <span className="text-xs">Profile</span>
      </NavLink>
    </div>
  );
};

export default BottomNav;
