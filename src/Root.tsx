import { Outlet, redirect } from "react-router";
import { memo, useEffect } from "react";
import { useStateStore } from "./state/store";
import GlobalContextMenu from "./components/GlobalContextMenu";
import { invalidateCacheForEndpoint } from "./state/helpers";

function Root() {
  const { isAuthenticated, loadPlayer } = useStateStore((store) => store);

  // useEffect(() => {
  //   if (isAuthenticated) loadPlayer();
  // }, [isAuthenticated, loadPlayer]);

  // useEffect(() => {
  //   const invalidateCache = async () => {
  //     await invalidateCacheForEndpoint("/v1/me/playlists?limit=50");
  //   };
  //   invalidateCache();
  // }, []);

  return (
    <>
      <Outlet />
      <GlobalContextMenu />
    </>
  );
}

export const initialLoader = async () => {
  const { isAuthenticated, initAuth, autoRefreshToken } =
    useStateStore.getState();

  if (!isAuthenticated) await initAuth();

  // Start the auto refresh timer if the token is valid
  await autoRefreshToken();

  redirect("/home");

  return null;
};

export default memo(Root);
