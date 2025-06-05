import { Outlet, redirect } from "react-router";
import { memo, useEffect } from "react";
import { store, useStateStore } from "./state/store";

function Root() {
  const { isAuthenticated, loadPlayer } = useStateStore((store) => store);

  // useEffect(() => {
  //   if (isAuthenticated) loadPlayer();
  // }, [isAuthenticated, loadPlayer]);

  return <Outlet />;
}

export const initialLoader = async () => {
  const isAuthenticated = useStateStore.getState().isAuthenticated;
  const initAuth = useStateStore.getState().initAuth;
  const autoRefreshToken = useStateStore.getState().autoRefreshToken;

  if (!isAuthenticated) await initAuth();

  // ! to start the auto refresh timer
  await autoRefreshToken();

  redirect("/home");

  return null;
};

export default memo(Root);
