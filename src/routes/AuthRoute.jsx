import { Navigate } from "react-router-dom";
import { getAccessToken, getUserData } from "../Utils/auth-utils";

const AuthRoute = ({ children }) => {
  const token = getAccessToken();
  const userData = getUserData();
  const role = userData?.role?.toLowerCase();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AuthRoute;
