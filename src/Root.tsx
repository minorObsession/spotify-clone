import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuthStore } from "./auth/Auth.z";

function Root() {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const navigate = useNavigate();
  const { initAuth } = useAuthStore();

  useEffect(() => {
    const verifyAuth = async () => {
      if (isAuthenticated) navigate("home");
      else await initAuth();
    };
    verifyAuth();
  }, [isAuthenticated, navigate, initAuth]);

  return <Outlet />;
}

export default Root;
