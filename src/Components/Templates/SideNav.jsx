import { useUser } from "../../Context/UserContext";
import axios from "../../Utils/axios";
import { Link, NavLink, useNavigate } from "react-router-dom";

const SideNav = () => {
  const navigate = useNavigate();
  const {profileData} = useUser();

  const handleLogout = async () => {
    try {
    
      await axios.post("/auth/logout");
    } catch (error) {
      console.error("error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

     
      navigate("/", { replace: true });
    }
  };

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
        hidden md:flex flex-col justify-between
        w-20 lg:w-[17vw]
        shrink-0
        h-screen overflow-y-auto
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
          <NavLink to="/profile" className={navLinkClass}>
            <i class="ri-user-fill text-xl"></i>
            <span className="hidden lg:inline ml-3">Profile</span>
          </NavLink>
        </nav>
        
      </div>
      <div className="flex items-center justify-start gap-3 hover:bg-violet-400 px-4 py-2 rounded-lg">
           <div className="rounded-full bg-amber-300 h-9 w-9 text-center">
            <img
              src={profileData?.avatar_url}
              alt="Profile"
              className="w-10 h-10 rounded-full border border-violet-500 object-cover"
            />
          </div>
          <div className="hidden lg:inline">
            <p className="text-lg">{profileData?.name}</p>
            <p className="text-sm" onClick={handleLogout}>Log Out</p>
          </div>
            
          </div>
      
    </div>
  );
};

export default SideNav;
