import { NavItem } from "../Common/SideNavLayout";
import SideNavLayout from "../Common/SideNavLayout";

const StaffSideNav = () => {
    return (
        <SideNavLayout>
            <NavItem to="/dashboard" icon="ri-dashboard-fill" label="Task Overview" />
            <NavItem to="/assigned-issues" icon="ri-task-fill" label="Assigned Tasks" />

            <NavItem to="/help-support" icon="ri-customer-service-2-fill" label="Help & Support" />
            <NavItem to="/profile" icon="ri-user-fill" label="My Profile" />
        </SideNavLayout>
    );
};

export default StaffSideNav;
