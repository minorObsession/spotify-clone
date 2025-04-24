import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// import { SpotifyInitializer } from "./features/playback/spotifyPlayer.tsx";
// import { loadSpotifySDK } from "./features/playback/spotifyPlayer.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    {/* <SpotifyInitializer /> */}
  </StrictMode>,
);
// loadSpotifySDK();
