import { useUser } from "../Context/ProfileContext";
import AdminDashboard from "./Dashboards/Admin/AdminDashboard";
import StudentDashboard from "./Dashboards/Student/StudentDashboard";
import StaffDashboard from "./Dashboards/Staff/StaffDashboard";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { profileData } = useUser();

  // Loading state handling could be added here if profileData is initially undefined
  // For now, we assume profileData might be null during fetch, handled by Context or AuthRoute.

  if (!profileData) {
    // Option: Return a loading spinner
    // return <div>Loading...</div>;
    // Or fallback to generic/admin if we want to be safe, but typically we wait.
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Loading...
      </div>
    );
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
