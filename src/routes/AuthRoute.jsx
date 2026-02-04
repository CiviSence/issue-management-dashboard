import { Navigate } from "react-router-dom";
import { getAccessToken } from "../Utils/auth-utils";

const AuthRoute = ({ children }) => {
  const token = getAccessToken();

  return token ? <Navigate to="/dashboard" replace /> : children;
};

export default AuthRoute;
