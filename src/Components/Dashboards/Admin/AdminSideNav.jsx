import { NavItem } from "../Common/SideNavLayout";
import SideNavLayout from "../Common/SideNavLayout";

const AdminSideNav = () => {
  return (
    <SideNavLayout>
      <NavItem to="/dashboard" icon="ri-dashboard-fill" label="Dashboard" />
      <NavItem to="/reported-issues" icon="ri-alarm-warning-fill" label="Reported Issues" />
      <NavItem to="/resolved-issues" icon="ri-shield-check-fill" label="Resolved Issues" />
      <NavItem to="/leaderboard" icon="ri-award-fill" label="Leaderboard" />

      <NavItem to="/help-support" icon="ri-customer-service-2-fill" label="Help & Support" />
      <NavItem to="/profile" icon="ri-user-fill" label="Profile" />
    </SideNavLayout>
  );
};

export default AdminSideNav;

