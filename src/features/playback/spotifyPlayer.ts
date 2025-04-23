// spotifySDK.ts
import { AccessTokenType } from "../auth/Auth";
import { getFromLocalStorage } from "../auth/authHelpers";

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

export const getSpotifyDeviceId = async (): Promise<string> => {
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

// Create a global promise that will resolve when the player is ready
const createPlayerReadyPromise = () => {
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
  const accessToken = getFromLocalStorage<AccessTokenType>("access_token");
  if (!accessToken) {
    console.error("Access token not found");
    window.resolveSpotifyPlayer(""); // Resolve with empty string to indicate failure
    return;
  }

  const player = new window.Spotify.Player({
    name: "Web Player",
    getOAuthToken: (cb: (token: string) => void) => {
      cb(accessToken.token);
    },
    volume: 0.5,
  });

  // * ready listener - transfer playback to this device
  player.addListener("ready", ({ device_id }: { device_id: string }) => {
    console.log("Ready with Device ID", device_id);
    window.spotifyPlayer = player;
    window.spotifyDeviceId = device_id;
    window.resolveSpotifyPlayer(device_id); // Resolve the promise with device ID

    console.log("callig fetch to transfer playback");
    // In the "ready" listener
    fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device_ids: [device_id],
        play: false, // or true if you want to auto-play
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Playback transfer failed");
        console.log("Playback transferred to Web SDK");
      })
      .catch((err) => {
        console.error("Failed to transfer playback:", err);
      });

    // ✅ Notify Zustand after player is ready
    import("../../state/store").then(({ store }) => {
      store.getState().setPlayer(player);
    });

    player.addListener(
      "player_state_changed",
      ({ position, duration, track_window: { current_track } }) => {
        console.log("Currently Playing", current_track);
        console.log("Position in Song", position);
        console.log("Duration of Song", duration);

        // ✅ Notify Zustand after change has occured
        import("../../state/store").then(({ store }) => {
          store.getState().updateUIOnStateChange({
            position,
            duration,
            track_window: { current_track },
          });
        });
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

export const loadSpotifySDK = () => {
  if (window.Spotify) {
    console.log("Spotify SDK already loaded");
    return;
  }

  const script = document.createElement("script");
  script.src = "https://sdk.scdn.co/spotify-player.js";
  script.defer = true;
  document.body.appendChild(script);
};
