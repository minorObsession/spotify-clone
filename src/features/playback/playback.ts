import { StateCreator } from "zustand";
import { StateStore } from "../../state/store";
// import { TrackType } from "../tracks/track";
import { fetchFromSpotify } from "../../state/helpers";
import { getSpotifyDeviceId } from "./spotifyPlayer";
import { makeRequestBody } from "./playbackHelpers";

// todo / ideas
export interface PlaybackSlice {
  myDevices: DeviceType[];
  player: Spotify.Player | null;
  deviceId: string | null;
  playerState: Spotify.PlaybackState | null;

  setPlayer: (playerInstance: Spotify.Player) => void;
  getDevices: () => void;
  getPlayerState: () => Promise<void>;
  togglePlayback: () => void;

  setPlayerState: (newState: Spotify.PlaybackState) => void;
  updateUIOnStateChange: (newState: any) => void;
  playTrack: (
    uri: string,
    dataType: "artist" | "album" | "playlist" | "track",
  ) => Promise<void>;
  ensureDeviceId: () => Promise<string>;
}
interface DeviceType {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

export const createPlaybackSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  PlaybackSlice
> = (set, get) => ({
  player: null,
  playerState: null,
  myDevices: [],
  deviceId: window.spotifyDeviceId,
  // ! define player type

  // * Player related stuff
  setPlayer: (playerInstance) => set({ player: playerInstance }),

  // state obj
  // { position, duration, track_window: { current_track } }
  setPlayerState: (newState) => set({ playerState: newState }),

  ensureDeviceId: async () => {
    const { deviceId } = get();
    if (deviceId) {
      return deviceId;
    }

    try {
      const deviceId = await getSpotifyDeviceId();
      if (deviceId) {
        set({ deviceId });
        return deviceId;
      }

      throw new Error("Could not get a valid device ID");
    } catch (error) {
      console.error("Failed to ensure device ID:", error);
      throw error;
    }
  },

  getDevices: async () => {
    return await fetchFromSpotify<any, DeviceType[]>({
      endpoint: "me/player/devices",
      cacheName: "my_devices",
      transformFn: (data: any) => data.devices,
      onCacheFound: (data) => set({ myDevices: data }),
      onDataReceived: (data) => set({ myDevices: data }),
    });
  },

  playTrack: async (uri, dataType) => {
    try {
      // Ensure we have a device ID
      const deviceId = await get().ensureDeviceId();

      if (!deviceId) {
        throw new Error("No device ID available");
      }

      // fetch and play the track
      await fetchFromSpotify<any, any>({
        endpoint: "me/player/play",
        method: "PUT",
        deviceId: `?device_id=${deviceId}`,
        requestBody: makeRequestBody(uri, dataType),
      });

      // Update playing state

      const { getPlayerState } = get();
      // call playback state
      getPlayerState();

      // * todo: add track to Local storage so it can be retrieved at first load
      // UI: update player preview on bottom
    } catch (error) {
      console.error("Failed to play track:", error);
      throw error;
    }
  },

  updateUIOnStateChange: async (newState) => {
    const { player } = get();

    if (!player) {
      console.error("Player not initialized");
      return;
    }

    const state: Spotify.PlaybackState | null = await player.getCurrentState();

    if (!state) {
      console.error("Unable to fetch player state");
      return;
    }

    // ! check which changes and call the right method

    // if change == "curr-track", update

    // get current player state

    // Update the UI based on the new state

    // ! to be called when changing songs
  },

  // ! to use player to start/stop playback
  getPlayerState: async () => {
    // ! to be called only when changing songs
    const { player } = get();

    if (!player) {
      console.error("Player not initialized");
      return;
    }

    const state: Spotify.PlaybackState | null = await player.getCurrentState();

    set({ playerState: state });

    // return playerState;
  },

  togglePlayback: async () => {
    const { player } = get();

    if (!player) {
      console.error("Player not initialized");
      return;
    }

    player.togglePlay();

    // Update player state in local storage (progress)
    const state = await player.getCurrentState();

    const { playerState } = get();

    set({ playerState: state });
  },
});
