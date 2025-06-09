import { StateCreator } from "zustand";
import { StateStore, store } from "../../state/store";
import { fetchFromSpotify } from "../../state/helpers";
// import { getSpotifyDeviceId } from "./spotifyPlayer";
import { makeRequestBody } from "./playbackHelpers";
import { AsyncResult, wrapPromiseResult } from "../../types/reusableTypes";

export interface PlaybackSlice {
  currVolume: number;

  // transferPlayback(deviceId: string): Promise<void | null>;
  togglePlayback: () => Promise<AsyncResult<void>>;
  seekToPosition: (positionMs: number) => Promise<AsyncResult<void>>;
  setVolume: (newValue: number) => Promise<AsyncResult<void>>;
  playTrack: (
    uri: string,
    dataType: "artist" | "album" | "playlist" | "track" | "podcast",
    trackIndex?: number,
  ) => Promise<AsyncResult<void>>;
  nextTrack: () => Promise<AsyncResult<void>>;
  prevTrack: () => Promise<AsyncResult<void>>;
}

export const createPlaybackSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never], ["zustand/persist", unknown]],
  [],
  PlaybackSlice
> = (set, get) => ({
  currVolume: (() => {
    // Try to get from persisted state first, fallback to default
    const persistedState = get();
    return persistedState?.currVolume ?? 75;
  })(),

  // ! to stay!!!!

  setVolume: async (newValue) => {
    const { player } = store.getState();

    if (!player)
      return { success: false, error: new Error("Player not initialized") };

    return await wrapPromiseResult(
      (async () => {
        await player.setVolume(newValue);
        const volume = await player.getVolume();

        // Volume is now persisted automatically by persist middleware
        set({ currVolume: volume }, undefined, "playback/setVolume");
      })(),
    );
  },

  seekToPosition: async (positionMs) => {
    const { player } = store.getState();

    if (!player)
      return { success: false, error: new Error("Player not initialized") };

    return await wrapPromiseResult(player.seek(positionMs));
  },

  // ! THIS WILL ALWAYS THROW ERROR BECAUSE OF fetchFromSpotify!!!!!
  // ! THIS WILL ALWAYS THROW ERROR BECAUSE OF fetchFromSpotify!!!!!
  // ! THIS WILL ALWAYS THROW ERROR BECAUSE OF fetchFromSpotify!!!!!
  playTrack: async (uri, dataType, trackIndex = 0) => {
    console.log(uri, dataType, trackIndex);
    const { deviceId } = store.getState();

    if (!deviceId) {
      return { success: false, error: new Error("No device ID available") };
    }

    // fetch and play the track
    return await wrapPromiseResult(
      fetchFromSpotify<unknown, void>({
        endpoint: "me/player/play",
        method: "PUT",
        requestBody: makeRequestBody(uri, dataType, trackIndex),
      }),
    );

    // * todo: add track to Local storage so it can be retrieved at first load
    // UI: update player preview on bottom
  },

  togglePlayback: async () => {
    const { player } = store.getState();

    if (!player)
      return { success: false, error: new Error("Player not initialized") };

    return await wrapPromiseResult(player.togglePlay());
  },

  nextTrack: async () => {
    const { player } = store.getState();

    if (!player)
      return { success: false, error: new Error("Player not initialized") };

    return await wrapPromiseResult(player.nextTrack());
  },

  prevTrack: async () => {
    const { player } = store.getState();

    if (!player)
      return { success: false, error: new Error("Player not initialized") };

    return await wrapPromiseResult(player.previousTrack());
  },
});
