// spotifySDK.ts
import { AccessTokenType } from "../auth/Auth";
import { getFromLocalStorage } from "../auth/authHelpers";
import { store } from "../../state/store";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: typeof Spotify;
    spotifyPlayer: Spotify.Player | undefined;
    spotifyDeviceId: string;
    spotifyPlayerReady: Promise<string>; // Promise that resolves with deviceId
    resolveSpotifyPlayer: (deviceId: string) => void;
  }
}

// Create a global promise that will resolve when the player is ready
const createPlayerReadyPromise = () => {
  console.log("calling createPlayerReadyPromise");
  let resolver: (deviceId: string) => void;
  const promise = new Promise<string>((resolve) => {
    resolver = resolve;
  });
  window.spotifyPlayerReady = promise;
  window.resolveSpotifyPlayer = resolver!;
};

// Initialize the promise before SDK loads
createPlayerReadyPromise();

// Set up the callback for when SDK is ready
window.onSpotifyWebPlaybackSDKReady = () => {
  console.log("calling onSpotifyWebPlaybackSDKReady");
  const accessToken = getFromLocalStorage<AccessTokenType>("access_token");
  if (!accessToken) {
    console.error("Access token not found");
    window.resolveSpotifyPlayer(""); // Resolve with empty string to indicate failure
    return;
  }

  const player = new window.Spotify.Player({
    name: "Web Player",
    getOAuthToken: (cb: (token: string) => void) => {
      console.log(accessToken.token);
      cb(accessToken.token);
    },
    volume: 0.5,
  });

  // * when player is ready, do init state setting
  player.addListener("ready", async ({ device_id }: { device_id: string }) => {
    console.log("Ready with Device ID", device_id);
    window.spotifyPlayer = player;
    window.spotifyDeviceId = device_id;
    window.resolveSpotifyPlayer(device_id); // Resolve the promise with device ID

    // ✅ Notify Zustand after player is ready
    const { transferPlayback, setPlayer, setPlayerState } = store.getState();

    await transferPlayback(device_id);
    setPlayer(player);

    // ! listen for state changes
    player.addListener(
      "player_state_changed",
      (newState: Spotify.PlaybackState) => {
        // ✅ Notify Zustand after change has occured
        setPlayerState(newState);
      },
    );
  });

  player.addListener("not_ready", ({ device_id }: { device_id: string }) => {
    console.log("Device ID has gone offline", device_id);
    // You might want to handle reconnection here
  });

  player.connect().catch((error) => {
    console.error("Failed to connect Spotify player:", error);
    window.resolveSpotifyPlayer(""); // Resolve with empty to indicate failure
  });
};

export const getSpotifyDeviceId = async (): Promise<string> => {
  console.log("getSpotifyDeviceId called");
  // If device ID is already available, return it immediately
  if (window.spotifyDeviceId) {
    return window.spotifyDeviceId;
  }
  // If not available, wait for the player ready promise to resolve
  try {
    const deviceId = await window.spotifyPlayerReady;
    return deviceId;
  } catch (error) {
    console.error("Failed to get Spotify device ID:", error);
    throw new Error("Spotify player failed to initialize");
  }
};

let hasLoaded = false;
export const loadSpotifySDK = () => {
  if (hasLoaded) return;
  hasLoaded = true;
  console.log("calling loadSpotifySDK");

  if (window.Spotify) {
    console.log("Spotify SDK already loaded");
    return;
  }

  const script = document.createElement("script");
  script.src = "https://sdk.scdn.co/spotify-player.js";
  script.defer = true;
  document.body.appendChild(script);
};
