import SideNavLayout, { NavItem } from "../Common/SideNavLayout";

const StaffSideNav = () => {

  return (
    <SideNavLayout>
      <NavItem to="/dashboard" icon="ri-dashboard-line" iconActive="ri-dashboard-fill" label="Dashboard" />
      <NavItem
        to="/issue-pool"
        icon="ri-inbox-archive-line"
        iconActive="ri-inbox-archive-fill"
        label="Issue Pool"
      />
      <NavItem
        to="/assigned-issues"
        icon="ri-clipboard-line"
        iconActive="ri-clipboard-fill"
        label="Assigned Tasks"
      />
      <NavItem
        to="/notifications"
        icon="ri-notification-3-line"
        iconActive="ri-notification-3-fill"
        label="Notifications"
      />
    </SideNavLayout>
  );
};

export default StaffSideNav;
