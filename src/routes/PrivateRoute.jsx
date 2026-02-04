import { Navigate } from "react-router-dom";
import { getAccessToken } from "../Utils/auth-utils";

const PrivateRoute = ({ children }) => {
  const token = getAccessToken();

  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
