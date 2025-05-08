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

const initAuth = store.getState().initAuth;
const isAuthenticated = store.getState().isAuthenticated;
const autoRefreshToken = store.getState().autoRefreshToken;

export const initialLoader = async () => {
  if (!isAuthenticated) await initAuth();
  // ! to start the auto refresh timer
  autoRefreshToken();
  console.log("initialLoader redirecting");

  redirect("/home");

  return null;
};

export default memo(Root);
