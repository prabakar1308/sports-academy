import React from "react";
import { Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({ isEnabled, ...props }) => {
  return isEnabled ? <Route {...props} /> : <Navigate to="/cricket" />;
};

export default ProtectedRoute;
