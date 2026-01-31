import { NavLink } from "react-router-dom";

const BottomNav = () => {
  const navClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1
     ${
       isActive ? "text-white scale-110 transition-all" : "text-gray-200"
     }`;

  return (
    <div
      className="
        fixed bottom-0 left-0
        w-full
        h-16
       bg-violet-500
        rounded-t-3xl
        flex justify-around items-center
        lg:hidden
        z-50
      "
    >
      <NavLink to="/" className={navClass}>
        <i className="ri-home-4-fill text-xl"></i>
        <span className="text-xs">Home</span>
      </NavLink>

      <NavLink to="/dashboard" className={navClass}>
        <i class="ri-dashboard-fill text-xl"></i>
        <span className="text-xs">Dashboard</span>
      </NavLink>

      <NavLink to="/reported-issues" className={navClass}>
        <i class="ri-alarm-warning-fill text-xl"></i>
        <span className="text-xs">Issues</span>
      </NavLink>

      <NavLink to="/leaderboard" className={navClass}>
        <i class="ri-award-fill text-xl"></i>
        <span className="text-xs">Leaderboard</span>
      </NavLink>

      <NavLink to="/profile" className={navClass}>
        <i class="ri-user-fill text-xl"></i>
        <span className="text-xs">Profile</span>
      </NavLink>
    </div>
  );
};

export default BottomNav;