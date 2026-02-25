import { Navigate } from "react-router-dom";
import { getAccessToken, getUserData } from "../Utils/auth-utils";

const AuthRoute = ({ children }) => {
  const token = getAccessToken();
  const userData = getUserData();
  const role = userData?.role?.toLowerCase();

  if (token) {
    if (role === "student") {
      return <Navigate to="/feed" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AuthRoute;
