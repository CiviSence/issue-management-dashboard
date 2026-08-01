import { NavLink } from "react-router-dom";
import { useUser } from "../../Context/ProfileContext";
import { useNotifications } from "../NotificationProvider";

const BottomNav = () => {
  const { profileData } = useUser();
  const { unreadCount } = useNotifications();
  const role = profileData?.role?.toLowerCase();

  const navClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors
     ${
       isActive
         ? "text-indigo-600 dark:text-indigo-400 bg-[#F3F1FF] dark:bg-indigo-500/15 rounded-xl"
         : "text-gray-500 dark:text-dark-text-secondary hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-dark-elevated"
     }`;

  return (
    <div className="fixed z-50 bottom-0 left-0 right-0 md:hidden bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.3)] transition-colors">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {/* Dashboard */}
        <NavLink to="/dashboard" className={navClass}>
          {({ isActive }) => (
            <>
              <i
                className={`ri-dashboard-${isActive ? "fill" : "line"} text-xl`}
              ></i>
              <span className="text-[10px] font-medium">Home</span>
            </>
          )}
        </NavLink>

        {/* ADMIN LINKS */}
        {(role === "admin" || role === "institute") && (
          <>
            <NavLink to="/reported-issues" className={navClass}>
              {({ isActive }) => (
                <>
                  <i
                    className={`ri-alarm-warning-${isActive ? "fill" : "line"} text-xl`}
                  ></i>
                  <span className="text-[10px] font-medium">Issues</span>
                </>
              )}
            </NavLink>
            <NavLink to="/admin-panel" className={navClass}>
              {({ isActive }) => (
                <>
                  <i
                    className={`ri-terminal-window-${isActive ? "fill" : "line"} text-xl`}
                  ></i>
                  <span className="text-[10px] font-medium">Panel</span>
                </>
              )}
            </NavLink>
            <NavLink to="/notifications" className={navClass}>
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <i
                      className={`ri-notification-3-${isActive ? "fill" : "line"} text-xl`}
                    ></i>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-dark-card" />
                    )}
                  </div>
                  <span className="text-[10px] font-medium">Alerts</span>
                </>
              )}
            </NavLink>
          </>
        )}

        {/* STAFF LINKS */}
        {role === "staff" && (
          <>
            <NavLink to="/issue-pool" className={navClass}>
              {({ isActive }) => (
                <>
                  <i
                    className={`ri-inbox-archive-${isActive ? "fill" : "line"} text-xl`}
                  ></i>
                  <span className="text-[10px] font-medium">Pool</span>
                </>
              )}
            </NavLink>
            <NavLink to="/assigned-issues" className={navClass}>
              {({ isActive }) => (
                <>
                  <i
                    className={`ri-task-${isActive ? "fill" : "line"} text-xl`}
                  ></i>
                  <span className="text-[10px] font-medium">Tasks</span>
                </>
              )}
            </NavLink>
            <NavLink to="/notifications" className={navClass}>
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <i
                      className={`ri-notification-3-${isActive ? "fill" : "line"} text-xl`}
                    ></i>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-dark-card" />
                    )}
                  </div>
                  <span className="text-[10px] font-medium">Alerts</span>
                </>
              )}
            </NavLink>
          </>
        )}

        {/* STUDENT LINKS */}
        {role === "student" && (
          <>
            <NavLink to="/feed" className={navClass}>
              {({ isActive }) => (
                <>
                  <i
                    className={`ri-rss-${isActive ? "fill" : "line"} text-xl`}
                  ></i>
                  <span className="text-[10px] font-medium">Feed</span>
                </>
              )}
            </NavLink>
            <NavLink to="/help-support" className={navClass}>
              {({ isActive }) => (
                <>
                  <i
                    className={`ri-customer-service-2-${isActive ? "fill" : "line"} text-xl`}
                  ></i>
                  <span className="text-[10px] font-medium">Help</span>
                </>
              )}
            </NavLink>
          </>
        )}

        {/* Profile */}
        <NavLink to="/profile" className={navClass}>
          {({ isActive }) => (
            <>
              <i
                className={`ri-user-${isActive ? "fill" : "line"} text-xl`}
              ></i>
              <span className="text-[10px] font-medium">Profile</span>
            </>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNav;
