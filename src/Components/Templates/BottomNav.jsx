import { NavLink } from "react-router-dom";
import { useUser } from "../../Context/ProfileContext";

const BottomNav = () => {
  const { profileData } = useUser();
  const role = profileData?.role?.toLowerCase();

  const navClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 relative z-10
     ${isActive 
        ? "text-white drop-shadow-[0_0_10px_rgba(126,112,235,0.6)]" 
        : "text-white/50 transition-all duration-300 hover:text-white/80"
     }`;

  return (
    <div className="fixed z-50 bottom-5 left-4 right-4 md:hidden">
      {/* Liquid Glass Container */}
      <div
        className="
          relative flex items-center justify-around
          px-0 py-1
          rounded-4xl
          bg-[#5A50A6]/50
          backdrop-blur-sm
          border border-[#ffffff]
          min-w-[320px] max-w-[92vw]
        "
      >
        {/* Specular Highlight - Top Edge */}
        <div 
          className="absolute inset-x-6 top-[1px] h-[1px] bg-gradient-to-r from-transparent via-white/90 to-transparent rounded-full pointer-events-none" 
        />
        
        {/* Inner Purple Glow */}
        <div 
          className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-[#5A50A6]/60 to-transparent pointer-events-none" 
        />

        {/* Dashboard */}
        <NavLink to="/dashboard" className={navClass}>
          {({ isActive }) => (
            <div className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-white/15 shadow-[inset_0_1px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(126,112,235,0.3)]' : ''}`}>
              <i className="ri-dashboard-fill text-lg "></i>
              <span className="text-[10px] font-medium tracking-wide">Home</span>
            </div>
          )}
        </NavLink>

        {/* ADMIN LINKS */}
        {(role === "admin" || role === "institute") && (
          <>
            <NavLink to="/reported-issues" className={navClass}>
              {({ isActive }) => (
                <div className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-white/15 shadow-[inset_0_1px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(126,112,235,0.3)]' : ''}`}>
                  <i className="ri-alarm-warning-fill text-lg"></i>
                  <span className="text-[10px] font-medium tracking-wide">Issues</span>
                </div>
              )}
            </NavLink>
            <NavLink to="/admin-panel" className={navClass}>
              {({ isActive }) => (
                <div className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-white/15 shadow-[inset_0_1px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(126,112,235,0.3)]' : ''}`}>
                  <i className="ri-terminal-window-fill text-lg"></i>
                  <span className="text-[10px] font-medium tracking-wide">Panel</span>
                </div>
              )}
            </NavLink>
            <NavLink to="/notifications" className={navClass}>
              {({ isActive }) => (
                <div className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-white/15 shadow-[inset_0_1px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(126,112,235,0.3)]' : ''}`}>
                  <i className="ri-notification-3-fill text-lg"></i>
                  <span className="text-[10px] font-medium tracking-wide">Alerts</span>
                </div>
              )}
            </NavLink>
          </>
        )}

        {/* STAFF LINKS */}
        {role === "staff" && (
          <>
            <NavLink to="/assigned-issues" className={navClass}>
              {({ isActive }) => (
                <div className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-white/15 shadow-[inset_0_1px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(126,112,235,0.3)]' : ''}`}>
                  <i className="ri-task-fill text-lg"></i>
                  <span className="text-[10px] font-medium tracking-wide">Tasks</span>
                </div>
              )}
            </NavLink>
            <NavLink to="/notifications" className={navClass}>
              {({ isActive }) => (
                <div className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-white/15 shadow-[inset_0_1px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(126,112,235,0.3)]' : ''}`}>
                  <i className="ri-notification-3-fill text-lg "></i>
                  <span className="text-[10px] font-medium tracking-wide">Alerts</span>
                </div>
              )}
            </NavLink>
          </>
        )}

        {/* STUDENT LINKS */}
        {role === "student" && (
          <>
            <NavLink to="/feed" className={navClass}>
              {({ isActive }) => (
                <div className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-white/15 shadow-[inset_0_1px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(126,112,235,0.3)]' : ''}`}>
                  <i className="ri-rss-fill text-lg"></i>
                  <span className="text-[10px] font-medium tracking-wide">Feed</span>
                </div>
              )}
            </NavLink>
            <NavLink to="/help-support" className={navClass}>
              {({ isActive }) => (
                <div className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-white/15 shadow-[inset_0_1px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(126,112,235,0.3)]' : ''}`}>
                  <i className="ri-customer-service-2-fill text-lg"></i>
                  <span className="text-[10px] font-medium tracking-wide">Help</span>
                </div>
              )}
            </NavLink>
          </>
        )}

        {/* Profile */}
        <NavLink to="/profile" className={navClass}>
          {({ isActive }) => (
            <div className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-white/15 shadow-[inset_0_1px_6px_rgba(0,0,0,0.2),0_0_20px_rgba(126,112,235,0.3)]' : ''}`}>
              <i className="ri-user-fill text-lg"></i>
              <span className="text-[10px] font-medium tracking-wide">Profile</span>
            </div>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNav;