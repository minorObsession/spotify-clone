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
  isPlayerLoading: boolean; // NEW  player: Spotify.Player | null;
  player: Spotify.Player | null;
  playerState: Spotify.PlaybackState | null;
  deviceId: string | null;
  loadPlayer: () => void;
  initPlayer: () => void;
  setPlayerState: (
    newState: Spotify.PlaybackState | ((state: Spotify.PlaybackState) => any),
  ) => void;
  transferPlayback: (deviceId: string) => Promise<void>;
  cleanupPlayer: () => void;
}

export const createSpotifyPlayerSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never], ["zustand/persist", unknown]],
  [],
  SpotifyPlayerSlice
> = (set, get) => ({
  deviceId: null,
  isPlayerLoading: false,
  player: null,
  playerState: null,

  loadPlayer: () => {
    const player = get().player;
    if (player) return;

    set({ isPlayerLoading: true }, undefined, "spotifyPlayer/setPlayerLoading");

    // Always call initPlayer if Spotify SDK is already loaded
    if (window.Spotify && typeof window.Spotify.Player === "function") {
      get().initPlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = () => {
        get().initPlayer();
      };
    }
  },

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
      set(
        { deviceId: device_id, player, isPlayerLoading: false },
        undefined,
        "spotifyPlayer/playerReady",
      );

      const transferPlayback = get().transferPlayback;
      await transferPlayback(device_id);
    });

    player.addListener("not_ready", ({ device_id }) =>
      console.warn("Device offline", device_id),
    );

    player.connect().catch((e) => {
      console.error("Failed to connect", e);
    });

    player.addListener("player_state_changed", (newState) => {
      const setPlayerState = get().setPlayerState;
      setPlayerState(newState);
    });
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

  setPlayerState: (
    updater: Spotify.PlaybackState | ((state: Spotify.PlaybackState) => any),
  ) =>
    set(
      (state) => ({
        playerState:
          typeof updater === "function" ? updater(state.playerState!) : updater,
      }),
      undefined,
      "spotifyPlayer/setPlayerState",
    ),

  cleanupPlayer: () => {
    const { player } = get();
    if (player) {
      player.disconnect();
      set(
        { player: null, deviceId: null, playerState: null },
        undefined,
        "spotifyPlayer/disconnect",
      );
    }
  },
});
