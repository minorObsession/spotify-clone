import { StateCreator } from "zustand";
import { StateStore } from "../../state/store";
import { TrackType } from "../tracks/track";
import { fetchFromSpotify } from "../../state/helpers";

export interface PlaybackSlice {
  isPlaying: boolean;
  currentTrackId: string | null;
  currentTrackIndex: number;
  queue: TrackType[];
  isShuffled: boolean;
  originalQueue: TrackType[];
  myDevices: string[];

  getDevices: () => void;
  startPausePlayback: () => void;
  stopPlayback: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  shuffle: () => void;
  setQueue: (tracks: TrackType[], startIndex?: number) => void;
  playTrack: (track: TrackType) => void;
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
  currentTrackId: null,
  currentTrackIndex: -1,
  queue: [],
  isShuffled: false,
  originalQueue: [],
  myDevices: [],

  // ! TRYING TO GET DEVICES HERE!!!!
  // ! TRYING TO GET DEVICES HERE!!!!
  // ! TRYING TO GET DEVICES HERE!!!!
  // ! TRYING TO GET DEVICES HERE!!!!
  // ! TRYING TO GET DEVICES HERE!!!!
  // ! TRYING TO GET DEVICES HERE!!!!
  getDevices: async () => {
    return await fetchFromSpotify<any, any>({
      endpoint: "me/player/devices",
      cacheName: "myDevices",
      transformFn: (data: any) => console.log(data),
      onCacheFound: (data) => set({ myDevices: data }),
      onDataReceived: (data) => set({ myDevices: data }),
    });
  },

  startPausePlayback: () => {
    const { isPlaying, currentTrackId, currentTrackIndex, queue } = get();

    if (queue.length === 0) return;

    if (currentTrackId === null && queue.length > 0) {
      set({
        isPlaying: true,
        currentTrackId: queue[0].trackId,
        currentTrackIndex: 0,
      });
      return;
    }

    set({ isPlaying: !isPlaying });
  },

  stopPlayback: () => {
    set({
      isPlaying: false,
      currentTrackId: null,
      currentTrackIndex: -1,
    });
  },

  nextTrack: () => {
    const { queue, currentTrackIndex } = get();

    if (queue.length === 0) return;

    const nextIndex = (currentTrackIndex + 1) % queue.length;
    const nextTrack = queue[nextIndex];

    set({
      currentTrackId: nextTrack.trackId,
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
      currentTrackId: previousTrack.trackId,
      currentTrackIndex: previousIndex,
    });
  },

  shuffle: () => {
    const { queue, currentTrackId, isShuffled, originalQueue } = get();

    if (queue.length <= 1) return;

    if (isShuffled) {
      set({
        queue: [...originalQueue],
        isShuffled: false,
        currentTrackIndex: currentTrackId
          ? originalQueue.findIndex((track) => track.trackId === currentTrackId)
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
        currentTrackIndex: currentTrackId
          ? shuffledQueue.findIndex((track) => track.trackId === currentTrackId)
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
      currentTrackId: startTrack.trackId,
      currentTrackIndex: validIndex,
      queue: tracks,
      isShuffled: false,
      originalQueue: [...tracks],
    });
  },

  playTrack: (track) => {
    const { queue } = get();

    const trackIndex = queue.findIndex(
      (t: TrackType) => t.trackId === track.trackId,
    );

    if (trackIndex !== -1) {
      set({
        isPlaying: true,
        currentTrackId: track.trackId,
        currentTrackIndex: trackIndex,
      });
    } else {
      set({
        isPlaying: true,
        currentTrackId: track.trackId,
        currentTrackIndex: 0,
        queue: [track],
        isShuffled: false,
        originalQueue: [track],
      });
    }
  },
});
