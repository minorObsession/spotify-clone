import { Outlet, useNavigate } from "react-router";
import { useAuth } from "./auth/AuthContext";
import { useEffect } from "react";

function Root() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && window.location.pathname === "/") navigate("home");
  }, [isAuthenticated, navigate]);

  // if (!isAuthenticated)
  //   return (
  //     <>
  //       <h1>this is the root page - no user authenticated</h1>;
  //       <button className="">Login</button>
  //     </>
  //   );

  // ! if authenticatd user
  return <Outlet />;
}

export default Root;
