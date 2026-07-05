import { Navigate } from "react-router-dom";
import { getAccessToken, getUserData } from "../Utils/auth-utils";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = getAccessToken();
  const userRole = getUserData(); // roles : 'admin', 'student', 'staff'
  // Not authenticated → login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but wrong role → dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole.role)) {
    return <Navigate to="/" replace />; // -> /
  }

  return children;
};

export default ProtectedRoute;
