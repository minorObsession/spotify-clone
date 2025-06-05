import { StateCreator } from "zustand";
import { StateStore, store } from "../../state/store";
import { fetchFromSpotify } from "../../state/helpers";
// import { getSpotifyDeviceId } from "./spotifyPlayer";
import { makeRequestBody } from "./playbackHelpers";
import { getFromLocalStorage, saveToLocalStorage } from "../auth/authHelpers";

// todo / ideas
export interface PlaybackSlice {
  currVolume: number;

  // transferPlayback(deviceId: string): Promise<void | null>;
  togglePlayback: () => Promise<void>;
  seekToPosition: (positionMs: number) => Promise<void>;
  setVolume: (newValue: number) => Promise<void>;
  playTrack: (
    uri: string,
    dataType: "artist" | "album" | "playlist" | "track" | "podcast",
    trackIndex?: number,
  ) => Promise<void>;
  nextTrack: () => Promise<void>;
  prevTrack: () => Promise<void>;
}

export const createPlaybackSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  PlaybackSlice
> = (set) => ({
  currVolume: +JSON.parse(getFromLocalStorage("curr_volume") || "75"),

  // ! to stay!!!!

  setVolume: async (newValue) => {
    const { player } = store.getState();

    if (!player) {
      console.error("Player not initialized");
      return;
    }

    await player.setVolume(newValue);
    const volume = await player.getVolume();

    // save into ls
    saveToLocalStorage("curr_volume", volume);

    set({ currVolume: volume }, undefined, "playback/setVolume");
  },

  seekToPosition: async (positionMs: number) => {
    const { player } = store.getState();

    if (!player) {
      console.error("Player not initialized");
      return;
    }

    await player.seek(positionMs);
  },

  playTrack: async (uri, dataType, trackIndex = 0) => {
    console.log(uri, dataType, trackIndex);
    try {
      const { deviceId } = store.getState();

      if (!deviceId) {
        throw new Error("No device ID available");
      }

      // fetch and play the track
      await fetchFromSpotify<any, any>({
        endpoint: "me/player/play",
        method: "PUT",
        requestBody: makeRequestBody(uri, dataType, trackIndex),
      });

      // * todo: add track to Local storage so it can be retrieved at first load
      // UI: update player preview on bottom
    } catch (error) {
      console.error("Failed to play track:", error);
      throw error;
    }
  },

  togglePlayback: async () => {
    const { player } = store.getState();

    if (!player) {
      console.error("Player not initialized");
      return;
    }

    await player.togglePlay();
  },

  nextTrack: async () => {
    const { player } = store.getState();

    if (!player) {
      console.error("Player not initialized");
      return;
    }

    await player.nextTrack();
  },

  prevTrack: async () => {
    const { player } = store.getState();

    if (!player) {
      console.error("Player not initialized");
      return;
    }

    await player.previousTrack();
  },
});
