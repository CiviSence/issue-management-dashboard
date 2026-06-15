import { useUser } from "../../../Context/ProfileContext";
import AdminNotifications from "../Admin/AdminNotifications";
import StaffNotifications from "../Staff/StaffNotifications";
import { Navigate } from "react-router-dom";

const Notifications = () => {
  const { profileData } = useUser();
  const role = profileData?.role?.toLowerCase();

  if (role === "admin" || role === "institute") {
    return <AdminNotifications />;
  }
  if (role === "staff") {
    return <StaffNotifications />;
  }

  // Redirect any other role (like student) back to dashboard
  return <Navigate to="/dashboard" replace />;
};

export default Notifications;
