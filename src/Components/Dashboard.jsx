import { useUser } from "../Context/ProfileContext";
import AdminDashboard from "./Dashboards/Admin/AdminDashboard";
import StudentDashboard from "./Dashboards/Student/StudentDashboard";
import StaffDashboard from "./Dashboards/Staff/StaffDashboard";
import IssueFeed from "./Dashboards/Student/IssueFeed";
import { Navigate } from "react-router-dom";
import Loader from "./Templates/Loader";
import SEO from "./common/SEO";

const Dashboard = () => {
  const { profileData } = useUser();

  if (!profileData) {
    return <Loader />;
  }

  const role = profileData.role?.toLowerCase();

  if (role === "admin" || role === "institute") {
    return (
      <>
        <SEO
          title="Admin Analytics Dashboard"
          description="Real-time administrative overview of campus maintenance issues, resolution velocity, category heatmaps, and department efficiency."
          keywords="admin dashboard, campus analytics, maintenance tracking, facility resolution velocity"
        />
        <AdminDashboard />
      </>
    );
  }

  if (role === "student") {
    return (
      <>
        <SEO
          title="Student Campus Dashboard"
          description="View campus problem reports, track your submitted maintenance requests, and participate in community voting and feedback."
          keywords="student dashboard, campus reports, infrastructure feedback, university facility tracking"
        />
        <StudentDashboard />
      </>
    );
  }

  if (role === "staff") {
    return (
      <>
        <SEO
          title="Staff Maintenance Dashboard"
          description="Manage assigned campus infrastructure tasks, update work order statuses, and coordinate maintenance resolutions."
          keywords="staff dashboard, maintenance work orders, assigned campus tasks, facility resolution"
        />
        <StaffDashboard />
      </>
    );
  }

  // Fallback for unknown roles
  return <Navigate to="/login" replace />;
};

export default Dashboard;
