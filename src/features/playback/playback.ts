import { StateCreator } from "zustand";
import { StateStore } from "../../state/store";
import { TrackType } from "../tracks/track";
import { fetchFromSpotify } from "../../state/helpers";
import { getSpotifyDeviceId } from "./spotifyPlayer";

export interface PlaybackSlice {
  isPlaying: boolean;
  currentid: string | null;
  currentTrackIndex: number;
  queue: TrackType[];
  isShuffled: boolean;
  originalQueue: TrackType[];
  myDevices: DeviceType[];
  player: any;
  deviceId: string | null;

  getPlaybackState: () => Promise<void>;
  getDevices: () => void;
  startPausePlayback: () => void;
  stopPlayback: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  shuffle: () => void;

  setQueue: (tracks: TrackType[], startIndex?: number) => void;
  playTrack: (trackUri: string) => Promise<void>;
  startNewPlayback(deviceId: string): Promise<void>;
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
  isPlaying: false,
  currentid: null,
  currentTrackIndex: -1,
  queue: [],
  isShuffled: false,
  originalQueue: [],
  myDevices: [],
  player: window.spotifyPlayer,
  deviceId: window.spotifyDeviceId,

  // * API related stuff

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

  startNewPlayback: async (specificDeviceId) => {
    try {
      // Ensure we have a device ID
      const deviceId = specificDeviceId || (await get().ensureDeviceId());

      if (!deviceId) {
        throw new Error("No device ID available");
      }

      await fetchFromSpotify<any, any>({
        endpoint: "me/player",
        method: "PUT",
        requestBody: JSON.stringify({
          device_ids: [deviceId],
          play: true,
        }),
      });

      // Update state with the used device ID if it's not already set
      if (!get().deviceId) {
        set({ deviceId });
      }
    } catch (error) {
      console.error("Failed to start playback:", error);
      throw error;
    }
  },

  playTrack: async (trackUri) => {
    try {
      console.log("playTrack..", trackUri);
      // Ensure we have a device ID
      const deviceId = await get().ensureDeviceId();

      if (!deviceId) {
        throw new Error("No device ID available");
      }

      await fetchFromSpotify<any, any>({
        endpoint: "me/player/play",
        method: "PUT",
        deviceId: `?device_id=${deviceId}`,
        requestBody: JSON.stringify({
          uris: [trackUri],
          position_ms: 0,
        }),
      });

      // make promise that resolves in 2s
    } catch (error) {
      console.error("Failed to play track:", error);
      throw error;
    }
  },

  getPlaybackState: async () => {
    return await fetchFromSpotify<any, any>({
      endpoint: "me/player",
      // cacheName: "playback_state",
      transformFn: (data: any) => console.log(data),
    });
  },

  // * zustand related stuff

  startPausePlayback: () => {
    const { isPlaying, currentid, queue } = get();
    console.log(get().player);

    if (queue.length === 0) return;

    if (currentid === null && queue.length > 0) {
      set({
        isPlaying: true,
        currentid: queue[0].id,
        currentTrackIndex: 0,
      });
      return;
    }

    set({ isPlaying: !isPlaying });
  },

  stopPlayback: () => {
    set({
      isPlaying: false,
      currentid: null,
      currentTrackIndex: -1,
    });
  },

  nextTrack: () => {
    const { queue, currentTrackIndex } = get();

    if (queue.length === 0) return;

    const nextIndex = (currentTrackIndex + 1) % queue.length;
    const nextTrack = queue[nextIndex];

    set({
      currentid: nextTrack.id,
      currentTrackIndex: nextIndex,
    });
  },

  previousTrack: () => {
    const { queue, currentTrackIndex } = get();

    if (queue.length === 0) return;

    const previousIndex =
      currentTrackIndex <= 0 ? queue.length - 1 : currentTrackIndex - 1;
    const previousTrack = queue[previousIndex];

    set({
      currentid: previousTrack.id,
      currentTrackIndex: previousIndex,
    });
  },

  shuffle: () => {
    const { queue, currentid, isShuffled, originalQueue } = get();

    if (queue.length <= 1) return;

    if (isShuffled) {
      set({
        queue: [...originalQueue],
        isShuffled: false,
        currentTrackIndex: currentid
          ? originalQueue.findIndex((track) => track.id === currentid)
          : -1,
      });
    } else {
      const shuffledQueue = [...queue];
      for (let i = shuffledQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQueue[i], shuffledQueue[j]] = [
          shuffledQueue[j],
          shuffledQueue[i],
        ];
      }

      set({
        queue: shuffledQueue,
        originalQueue: [...queue],
        isShuffled: true,
        currentTrackIndex: currentid
          ? shuffledQueue.findIndex((track) => track.id === currentid)
          : -1,
      });
    }
  },

  setQueue: (tracks, startIndex = 0) => {
    if (!tracks || tracks.length === 0) return;

    const validIndex = Math.max(0, Math.min(startIndex, tracks.length - 1));
    const startTrack = tracks[validIndex];

    set({
      isPlaying: true,
      currentid: startTrack.id,
      currentTrackIndex: validIndex,
      queue: tracks,
      isShuffled: false,
      originalQueue: [...tracks],
    });
  },

  // playTrack: (track) => {
  //   const { queue } = get();

  //   const trackIndex = queue.findIndex(
  //     (t: TrackType) => t.id === track.id,
  //   );

  //   if (trackIndex !== -1) {
  //     set({
  //       isPlaying: true,
  //       currentid: track.id,
  //       currentTrackIndex: trackIndex,
  //     });
  //   } else {
  //     set({
  //       isPlaying: true,
  //       currentid: track.id,
  //       currentTrackIndex: 0,
  //       queue: [track],
  //       isShuffled: false,
  //       originalQueue: [track],
  //     });
  //   }
  // },
});
