import { StateCreator } from "zustand";
import { StateStore } from "../../state/store";
import { fetchFromSpotify } from "../../state/helpers";
import { getSpotifyDeviceId } from "./spotifyPlayer";
import { makeRequestBody } from "./playbackHelpers";

// todo / ideas
export interface PlaybackSlice {
  myDevices: DeviceType[];
  player: Spotify.Player | null;
  deviceId: string | null;
  playerState: Spotify.PlaybackState | null;
  currVolume: number;

  transferPlayback(deviceId: string): Promise<void | null>;
  setPlayer: (playerInstance: Spotify.Player) => void;
  getDevices: () => Promise<DeviceType[] | null>;
  getPlayerState: () => Promise<void>;
  togglePlayback: () => Promise<void>;
  seekToPosition: (positionMs: number) => Promise<void>;
  setVolume: (newValue: number) => Promise<void>;
  setPlayerState: (newState: Spotify.PlaybackState) => void;
  playTrack: (
    uri: string,
    dataType: "artist" | "album" | "playlist" | "track",
  ) => Promise<void>;
  nextTrack: () => Promise<void>;
  prevTrack: () => Promise<void>;
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
  currVolume: +JSON.parse(localStorage.getItem("curr_volume") || "75"),
  deviceId: window.spotifyDeviceId,

  transferPlayback: async (deviceId: string) => {
    return await fetchFromSpotify({
      endpoint: "me/player",
      deviceId: "", // deviceId gets added below manually to query
      method: "PUT",
      requestBody: JSON.stringify({
        device_ids: [deviceId],
        play: false,
      }),
    });
  },
  // * Player related stuff
  setPlayer: (playerInstance) => set({ player: playerInstance }),

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

  setVolume: async (newValue) => {
    const { player } = get();

    if (!player) {
      console.error("Player not initialized");
      return;
    }

    await player.setVolume(newValue);
    const volume = await player.getVolume();

    // save into ls
    localStorage.setItem("curr_volume", JSON.stringify(volume));

    set({ currVolume: volume });
    // return volume;
  },

  seekToPosition: async (positionMs: number) => {
    const { player } = get();

    if (!player) {
      console.error("Player not initialized");
      return;
    }

    await player.seek(positionMs);
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

  getPlayerState: async () => {
    const { player } = get();

    if (!player) {
      console.error("Player not initialized");
      return;
    }

    const state: Spotify.PlaybackState | null = await player.getCurrentState();

    set({ playerState: state });
  },

  togglePlayback: async () => {
    const { player } = get();

    if (!player) {
      console.error("Player not initialized");
      return;
    }

    await player.togglePlay();
  },

  nextTrack: async () => {
    const { player } = get();

    if (!player) {
      console.error("Player not initialized");
      return;
    }

    await player.nextTrack();
  },

  prevTrack: async () => {
    const { player } = get();

    if (!player) {
      console.error("Player not initialized");
      return;
    }

    await player.previousTrack();
  },
});
