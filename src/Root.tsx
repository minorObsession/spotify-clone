import { Outlet, redirect } from "react-router";
import { memo, useEffect } from "react";
import { useStateStore } from "./state/store";

function Root() {
  const { isAuthenticated, loadPlayer } = useStateStore((store) => store);

  // useEffect(() => {
  //   if (isAuthenticated) loadPlayer();
  // }, [isAuthenticated, loadPlayer]);

  return <Outlet />;
}

export const initialLoader = async () => {
  const { accessToken, initAuth, autoRefreshToken } = useStateStore.getState();

  const isAuthTokenValid =
    (accessToken?.token && accessToken.expiresAt > Date.now()) || false;
  console.log("isAuthTokenValid", isAuthTokenValid);
  if (!isAuthTokenValid) await initAuth();

  // Start the auto refresh timer if the token is valid
  await autoRefreshToken();

  redirect("/home");

  return null;
};

export default memo(Root);
