import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { useStateStore } from "./state/store";
// import { useAuthStore } from "./state/Auth.z";

function Root() {
  const navigate = useNavigate();
  const initAuth = useStateStore((store) => store.initAuth);
  const isAuthenticated = useStateStore((store) => store.isAuthenticated);
  const autoRefreshToken = useStateStore((store) => store.autoRefreshToken);

  useEffect(() => {
    const verifyAuth = async () => {
      if (isAuthenticated) {
        // ! to start the auto refresh timer
        autoRefreshToken();
        navigate("/home");
      } else await initAuth();
    };
    verifyAuth();
  }, [isAuthenticated, navigate, initAuth, autoRefreshToken]);

  return <Outlet />;
}

export default Root;
