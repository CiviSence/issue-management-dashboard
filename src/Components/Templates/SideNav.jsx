import { Link, NavLink } from "react-router-dom";

const SideNav = () => {
  const navLinkClass = ({ isActive }) =>
    `flex items-center justify-center lg:justify-start
     rounded-lg px-4 py-3 transition
     ${
       isActive
         ? "bg-white text-violet-500 font-semibold"
         :  "hover:text-white hover:bg-violet-400"
     }`;

  return (
    <div
      className=" bg-violet-500
        hidden sm:flex
        w-20 lg:w-[17vw]
        shrink-0
        h-screen overflow-y-auto
        border-r border-zinc-600
        p-3 lg:p-5 xl:p-8
        text-white
        rounded-r-3xl
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
          <NavLink to="/" className={navLinkClass}>
            <i className="ri-home-4-fill text-xl"></i>
            <span className="hidden lg:inline ml-3">Home</span>
          </NavLink>

          <NavLink to="/dashboard" className={navLinkClass}>
           <i class="ri-dashboard-fill text-xl"></i>
            <span className="hidden lg:inline ml-3">Dashboard</span>
          </NavLink>

          <NavLink to="/reported-issues" className={navLinkClass}>
            <i class="ri-alarm-warning-fill text-xl"></i>
            <span className="hidden lg:inline ml-3">Reported Issues</span>
          </NavLink>

          <NavLink to="/resolved-issues" className={navLinkClass}>
            <i class="ri-shield-check-fill text-xl"></i>
            <span className="hidden lg:inline ml-3">Resolved Issues</span>
          </NavLink>

          <NavLink to="/leaderboard" className={navLinkClass}>
            <i class="ri-award-fill text-xl"></i>
            <span className="hidden lg:inline ml-3">Leaderboard</span>
          </NavLink>

        </nav>
      </div>
    </div>
  );
};

export default SideNav;
