import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import ReportedIssues from "./Components/Dashboards/Admin/ReportedIssues";
import ResolvedIssues from "./Components/Dashboards/Admin/ResolvedIssues";
import Leaderboard from "./Components/Dashboards/Admin/Leaderboard";
import Profile from "./Components/Profile";
import AssignedIssues from "./Components/Dashboards/Staff/AssignedIssues";
import IssueDetails from "./Components/Dashboards/Admin/IssuesDetails";
import HelpSupport from "./Components/Dashboards/Common/HelpSupport";
import Login from "./Pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
import AuthRoute from "./routes/AuthRoute";
import SignUp from "./Pages/SignUp";
import Verify from "./Pages/Verify";
import IssueFeed from "./Components/Dashboards/Student/IssueFeed";
import StudentDashboard from "./Components/Dashboards/Student/StudentDashboard";
import MyIssues from "./Components/Dashboards/Student/MyIssues";
import { ThemeProvider } from "./Context/ThemeContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

const App = () => {
  return (
    <ThemeProvider>
      <div className="w-full h-screen bg-[#F0EEFF] flex ">
        <Routes>
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <AuthRoute>
                <SignUp />
              </AuthRoute>
            }
          />

          <Route
            path="/verify-otp"
            element={
              <AuthRoute>
                <Verify />
              </AuthRoute>
            }
          />

          <Route
            path="/"
            element={
              <AuthRoute>
                <Home />
              </AuthRoute>
            }
          />

          {/* private routes - requires login/signup */}

          {/* dynamic dashboard - redirects to <AdminDashboard/> <StudentDashboard/> and <StaffDashboard/> on the basis of userRole */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/help-support"
            element={
              <PrivateRoute>
                <HelpSupport />
              </PrivateRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <PrivateRoute>
                <Leaderboard />
              </PrivateRoute>
            }
          />

          {/* protected routes - role based access */}

          <Route
            path="/reported-issues"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ReportedIssues />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resolved-issues"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ResolvedIssues />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pending-issues"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ReportedIssues />
              </ProtectedRoute>
            }
          />

          <Route
            path="/in-progress"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ReportedIssues />
              </ProtectedRoute>
            }
          />

          <Route
            path="/assigned-issues"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <AssignedIssues />
              </ProtectedRoute>
            }
          />

          <Route
            path="/issues/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <IssueDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/feed"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <IssueFeed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-issues"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <MyIssues />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
