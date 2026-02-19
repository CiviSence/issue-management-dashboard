import { useUser } from "../Context/ProfileContext";
import AdminDashboard from "./Dashboards/Admin/AdminDashboard";
import StudentDashboard from "./Dashboards/Student/StudentDashboard";
import StaffDashboard from "./Dashboards/Staff/StaffDashboard";
import { Navigate } from "react-router-dom";
import Loader from "./Templates/Loader";

const Dashboard = () => {
  const { profileData } = useUser();

  if (!profileData) {
    return <Loader />;
  }

  const role = profileData.role?.toLowerCase() || "guest";

  if (role === "admin" || role === "institute") {
    return <AdminDashboard />;
  }

  if (role === "student") {
    return <StudentDashboard />;
  }

  if (role === "staff") {
    return <StaffDashboard />;
  }

  // Fallback for unknown roles
  return <Navigate to="/login" replace />;
};

export default Dashboard;
