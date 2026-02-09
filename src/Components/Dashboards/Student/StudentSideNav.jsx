import { NavItem } from "../Common/SideNavLayout";
import SideNavLayout from "../Common/SideNavLayout";

const StudentSideNav = () => {
    return (
        <SideNavLayout>
            <NavItem to="/dashboard" icon="ri-dashboard-fill" label="My Dashboard" />
            {/* <NavItem to="/my-issues" icon="ri-dashboard-fill" label="My Issues" /> */}
            <NavItem to="/help-support" icon="ri-customer-service-2-fill" label="Help & Support" />
            <NavItem to="/profile" icon="ri-user-fill" label="My Profile" />
        </SideNavLayout>
    );
};

export default StudentSideNav;
