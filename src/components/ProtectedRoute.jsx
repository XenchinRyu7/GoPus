import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, isTokenExpired, clearAuth } from "@/utils/auth";

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated() || isTokenExpired()) {
    clearAuth();
    return <Navigate to="/auth/sign-in" replace />;
  }
  return children;
};

export default ProtectedRoute;
