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
    accessToken?.token && accessToken.expiresAt > Date.now();

  if (!isAuthTokenValid) await initAuth();

  // ! to start the auto refresh timer
  await autoRefreshToken();

  redirect("/home");

  return null;
};

export default memo(Root);
