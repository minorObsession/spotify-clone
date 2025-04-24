import { Outlet, redirect, useNavigate } from "react-router";
import { useEffect } from "react";
import { store, useStateStore } from "./state/store";
import { loadSpotifySDK } from "./features/playback/spotifyPlayer";
// import { useAuthStore } from "./state/Auth.z";
loadSpotifySDK();

function Root() {
  const { isAuthenticated } = useStateStore((store) => store);

  useEffect(() => {
    loadSpotifySDK();
  }, [isAuthenticated]);

  return <Outlet />;
}

const initAuth = store.getState().initAuth;
const isAuthenticated = store.getState().isAuthenticated;
const autoRefreshToken = store.getState().autoRefreshToken;

export const initialLoader = async () => {
  if (!isAuthenticated) await initAuth();
  // ! to start the auto refresh timer
  autoRefreshToken();
  redirect("/home");

  return null;
};

export default Root;
