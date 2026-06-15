// import { Link, useLocation } from "react-router-dom";
// import { LayoutDashboard, CheckSquare, Settings } from "lucide-react";
// import { useTheme } from "../../../Context/ThemeContext";
import SideNavLayout, { NavItem } from "../Common/SideNavLayout";

const StaffSideNav = () => {
  // const location = useLocation();
  // const { toggleTheme, theme } = useTheme();

  // const isActive = (path) => location.pathname === path;

  return (
    <SideNavLayout>
      <NavItem to="/dashboard" icon="ri-dashboard-fill" label="Dashboard" />
      <NavItem
        to="/assigned-issues"
        icon="ri-clipboard-line"
        label="Assigned Tasks"
      />

      <NavItem
        to="/notifications"
        icon="ri-notification-3-fill"
        label="Notifications"
      />
      <NavItem to="/profile" icon="ri-user-fill" label="My Profile" />
    </SideNavLayout>
  );
};

export default StaffSideNav;

{
  /* <div className="hidden lg:flex flex-col w-[15vw] h-screen bg-card border-r border-border fixed left-0 top-0 z-50 transition-colors duration-200">
            <div className="p-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Staff Panel
                </h2>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                <Link to="/dashboard"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/dashboard')
                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}>
                    <LayoutDashboard size={20} />
                    <span className="font-medium">Dashboard</span>
                </Link>

                <Link to="/assigned-issues"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/assigned-issues')
                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}>
                    <CheckSquare size={20} />
                    <span className="font-medium">Assigned Tasks</span>
                </Link>
            </nav>

            <div className="p-4 border-t border-border">
                <button
                    onClick={toggleTheme}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer"
                >
                    <Settings size={20} />
                    <span className="font-medium">
                        {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
                    </span>
                </button>
            </div>
        </div> */
}
