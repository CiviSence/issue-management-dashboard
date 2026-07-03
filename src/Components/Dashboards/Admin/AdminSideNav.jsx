import { NavItem } from "../Common/SideNavLayout";
import SideNavLayout from "../Common/SideNavLayout";

const AdminSideNav = () => {
  return (
    <SideNavLayout>
      <NavItem to="/dashboard" icon="ri-dashboard-line" iconActive="ri-dashboard-fill" label="Dashboard" />
      <NavItem to="/reported-issues" icon="ri-alarm-warning-line" iconActive="ri-alarm-warning-fill" label="Reported Issues" />
      <NavItem to="/resolved-issues" icon="ri-shield-check-line" iconActive="ri-shield-check-fill" label="Resolved Issues" />
      <NavItem to="/admin-panel" icon="ri-terminal-window-line" iconActive="ri-terminal-window-fill" label="Admin Panel" />
      <NavItem to="/leaderboard" icon="ri-award-line" iconActive="ri-award-fill" label="Leaderboard" />
      <NavItem to="/notifications" icon="ri-notification-3-line" iconActive="ri-notification-3-fill" label="Notifications" />
      <NavItem to="/profile" icon="ri-user-line" iconActive="ri-user-fill" label="Profile" />
    </SideNavLayout>
  );
};

export default AdminSideNav;

