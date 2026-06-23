import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./Components/Dashboard";
import ReportedIssues from "./Components/Dashboards/Admin/ReportedIssues";
import ResolvedIssues from "./Components/Dashboards/Admin/ResolvedIssues";
import Leaderboard from "./Components/Dashboards/Admin/Leaderboard";
import Profile from "./Components/Profile";
import AssignedIssues from "./Components/Dashboards/Staff/AssignedIssues";

import IssueDetails from "./Components/Dashboards/Admin/IssuesDetails";
import HelpSupport from "./Components/Dashboards/Common/HelpSupport";
import Notifications from "./Components/Dashboards/Common/Notifications";
import Login from "./Pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
import AuthRoute from "./routes/AuthRoute";
import SignUp from "./Pages/SignUp";
import Verify from "./Pages/Verify";
import IssueFeed from "./Components/Dashboards/Student/IssueFeed";
import MyIssues from "./Components/Dashboards/Student/MyIssues";
import { ThemeProvider } from "./Context/ThemeContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { ForgotPassword, ResetPassword } from "./Pages/forgetPassword.jsx";
import AdminPanel from "./Components/Dashboards/Admin/AdminPanel.jsx";

import TaskDetails from "./Components/Dashboards/Staff/TaskDetails.jsx";
import TrustCenter from "./Pages/TrustCenter.jsx";
import { useEffect } from "react";
import { toast } from "react-toastify";
import PrivacyPolicy from "./Components/legal/privacyPolicy.jsx";
import TermsOfUse from "./Components/legal/TermsOfUse.jsx";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const App = () => {
  useEffect(() => {
    const handleVerificationRequired = () => {
      toast.error("Identity Verification Required to participate.", {
        position: "top-center",
        autoClose: 5000,
      });
    };
    window.addEventListener(
      "verification-required",
      handleVerificationRequired,
    );
    return () =>
      window.removeEventListener(
        "verification-required",
        handleVerificationRequired,
      );
  }, []);

  return (
    <ThemeProvider>
      <div className="w-full h-screen bg-white flex ">
        <Analytics />
        <SpeedInsights />
        <Routes>
          {/* public routes */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />

          {/* Auth Routs - login / signup / verify / forget password */}
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
            path="/forgot-password"
            element={
              <AuthRoute>
                <ForgotPassword />
              </AuthRoute>
            }
          />

          <Route
            path="/reset-password"
            element={
              <AuthRoute>
                <ResetPassword />
              </AuthRoute>
            }
          />

          <Route
            path="/"
            element={
              <AuthRoute>
                <Navigate to="/signup" replace />
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
            path="/notifications"
            element={
              <PrivateRoute>
                <Notifications />
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

          {/* admin */}
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
            path="/issues/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <IssueDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-panel"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          {/* staff */}
          <Route
            path="/assigned-issues"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <AssignedIssues />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/:id"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <TaskDetails />
              </ProtectedRoute>
            }
          />


          {/* students */}
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
          <Route
            path="/trust-center"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <TrustCenter />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
