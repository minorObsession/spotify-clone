// src/auth/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// ! ASSUMING there is a useAuth() context hook!
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // You could return a loading spinner here
    return <div>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to root if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
