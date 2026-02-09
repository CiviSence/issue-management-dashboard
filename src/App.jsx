import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import ReportedIssues from "./Components/Dashboards/Admin/ReportedIssues";
import ResolvedIssues from "./Components/Dashboards/Admin/ResolvedIssues";
import Leaderboard from "./Components/Dashboards/Admin/Leaderboard";
import Profile from "./Components/Profile";
import AssignedIssues from "./Components/Dashboards/Staff/AssignedIssues";

import HelpSupport from "./Components/Dashboards/Common/HelpSupport";
import Login from "./Pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
import AuthRoute from "./routes/AuthRoute";
import SignUp from "./Pages/SignUp";
import Verify from "./Pages/Verify";

const App = () => {
  return (
    <div className="w-full h-screen bg-[#F0EEFF] flex">
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

        {/* PROTECTED (only when logged in) */}


        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/reported-issues"
          element={
            <PrivateRoute>
              <ReportedIssues />
            </PrivateRoute>
          }
        />

        <Route
          path="/resolved-issues"
          element={
            <PrivateRoute>
              <ResolvedIssues />
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

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/pending-issues"
          element={
            <PrivateRoute>
              <ReportedIssues />
            </PrivateRoute>
          }
        />
        <Route
          path="/in-progress"
          element={
            <PrivateRoute>
              <ReportedIssues />
            </PrivateRoute>
          }
        />


        <Route
          path="/assigned-issues"
          element={
            <PrivateRoute>
              <AssignedIssues />
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
      </Routes>
    </div>
  );
};

export default App;
