import { NavItem } from "../Common/SideNavLayout";
import SideNavLayout from "../Common/SideNavLayout";

const AdminSideNav = () => {
  return (
    <SideNavLayout>
      <NavItem to="/dashboard" icon="ri-dashboard-fill" label="Dashboard" />
      <NavItem to="/reported-issues" icon="ri-alarm-warning-fill" label="Reported Issues" />
      <NavItem to="/resolved-issues" icon="ri-shield-check-fill" label="Resolved Issues" />
      <NavItem to="/admin-panel" icon="ri-terminal-window-fill" label="Admin Panel" />
      <NavItem to="/leaderboard" icon="ri-award-fill" label="Leaderboard" />
      <NavItem to="/notifications" icon="ri-notification-3-fill" label="Notifications" />
      <NavItem to="/profile" icon="ri-user-fill" label="Profile" />
    </SideNavLayout>
  );
};

export default AdminSideNav;

