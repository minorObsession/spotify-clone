import { Outlet, useNavigate } from "react-router";
import { useAuth } from "./auth/AuthContext";
import { useEffect } from "react";

function Root() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && window.location.pathname === "/") navigate("home");
  }, [isAuthenticated, navigate]);

  return <Outlet />;
}

export default Root;
