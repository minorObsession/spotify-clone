import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { useStateStore } from "./state/store";
// import { useAuthStore } from "./state/Auth.z";

function Root() {
  // const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  // const autoRefreshToken = useAuthStore((store) => store.autoRefreshToken);
  const navigate = useNavigate();
  // const { initAuth } = useAuthStore();
  const initAuth = useStateStore((store) => store.initAuth);
  const isAuthenticated = useStateStore((store) => store.isAuthenticated);
  const autoRefreshToken = useStateStore((store) => store.autoRefreshToken);

  useEffect(() => {
    const verifyAuth = async () => {
      console.log("isAuthenticated:", isAuthenticated);
      if (isAuthenticated) {
        autoRefreshToken();
        navigate("home");
      } else await initAuth();
    };
    verifyAuth();
  }, [isAuthenticated, navigate, initAuth, autoRefreshToken]);

  return <Outlet />;
}

export default Root;
