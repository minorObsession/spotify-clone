import { StateCreator } from "zustand";
import { AccessTokenType } from "../auth/Auth";
import { getFromLocalStorage } from "../auth/authHelpers";
import { StateStore } from "../../state/store";
import { fetchFromSpotify } from "../../state/helpers";

// * look into a way to not load the player every time the page reloads - big performance setback

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: typeof Spotify;
  }
}

export interface SpotifyPlayerSlice {
  // isPlayerLoaded: boolean;
  player: Spotify.Player | null;
  playerState: Spotify.PlaybackState | null;
  deviceId: string | null;
  loadPlayer: () => void;
  initPlayer: () => void;
  setPlayerState: (newState: Spotify.PlaybackState) => void;
  transferPlayback: (deviceId: string) => Promise<void>;
}

export const createSpotifyPlayerSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  SpotifyPlayerSlice
> = (set, get) => ({
  // isPlayerLoaded: false,
  deviceId: null,
  player: null,
  playerState: null,

  loadPlayer: () => {
    const { player } = get();
    if (player) return; // early return if player is already loaded

    // Set the global hook BEFORE the script is appended
    window.onSpotifyWebPlaybackSDKReady = () => {
      get().initPlayer(); // Call your slice's method
    };

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.defer = true;
    document.body.appendChild(script);
  },

  transferPlayback: async (deviceId: string) => {
    return await fetchFromSpotify<any, any>({
      endpoint: "me/player",
      method: "PUT",
      requestBody: JSON.stringify({
        device_ids: [deviceId],
        play: false,
      }),
    });
  },

  setPlayerState: (newState) => set({ playerState: newState }),

  initPlayer: () => {
    const accessToken = getFromLocalStorage<AccessTokenType>("access_token");
    if (!accessToken) {
      console.error("Access token missing");
      return;
    }

    const player = new window.Spotify.Player({
      name: "Web Player",
      getOAuthToken: (cb) => cb(accessToken.token),
      volume: 0.5,
    });

    player.addListener("ready", async ({ device_id }) => {
      set({ deviceId: device_id, player });

      const { transferPlayback } = get();
      await transferPlayback(device_id);
    });

    player.addListener("not_ready", ({ device_id }) =>
      console.warn("Device offline", device_id),
    );

    player.connect().catch((e) => {
      console.error("Failed to connect", e);
    });

    player.addListener("player_state_changed", (newState) => {
      const { setPlayerState } = get();
      setPlayerState(newState);
    });
  },
});
