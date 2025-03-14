import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuthStore } from "./auth/Auth.z";

function Root() {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && window.location.pathname === "/") navigate("home");
  }, [isAuthenticated, navigate]);

  return <Outlet />;
}

export default Root;
