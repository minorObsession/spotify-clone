import { StateCreator } from "zustand";
import { StateStore } from "../../state/store";
import { TrackType } from "../tracks/track";
import { fetchFromSpotify } from "../../state/helpers";
import { getSpotifyDeviceId } from "./spotifyPlayer";
import { makeRequestBody } from "./playbackHelpers";

// todo / ideas
// what are the different events of the player for?
//

export interface PlaybackSlice {
  isPlaying: boolean;
  currentid: string | null;
  currentTrackIndex: number;
  queue: TrackType[];
  isShuffled: boolean;
  originalQueue: TrackType[];
  myDevices: DeviceType[];
  player: Spotify.Player | null;
  deviceId: string | null;

  // ! define player type
  playerState: any;

  getPlaybackState: () => Promise<void>;
  getDevices: () => void;
  togglePlayback: () => void;
  stopPlayback: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  shuffle: () => void;

  setQueue: (tracks: TrackType[], startIndex?: number) => void;
  playTrack: (
    trackUri: string,
    dataType: "artist" | "album" | "playlist" | "track",
  ) => Promise<void>;
  startNewPlayback(deviceId: string): Promise<void>;
  ensureDeviceId: () => Promise<string>;
  setPlayer: (playerInstance: Spotify.Player) => void;
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
  // ! derive from player!!!!
  isPlaying: false,
  currentid: null,
  currentTrackIndex: -1,
  queue: [],
  isShuffled: false,
  originalQueue: [],
  myDevices: [],
  player: null,
  deviceId: window.spotifyDeviceId,

  // ! define player type
  playerState: null,

  // * Player related stuff
  setPlayer: (playerInstance) => set({ player: playerInstance }),

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

  // * API related stuff
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
      set({ isPlaying: true });
      const { getPlaybackState } = get();
      // call playback state
      getPlaybackState();

      // UI: update player preview on bottom
    } catch (error) {
      console.error("Failed to play track:", error);
      throw error;
    }
  },

  // ! to use player to start/stop playback
  getPlaybackState: async () => {
    // ! to be called only when changing songs
    const { player, isPlaying } = get();

    if (!player) {
      console.error("Player not initialized");
      return;
    }

    player.getCurrentState().then(async (state: any) => {
      // fake 0.5s timeout so we get correct state
      await new Promise(() => setTimeout((resolve: any) => resolve(), 500));

      if (!state) {
        console.error("User is not playing music through the Web Playback SDK");
        return;
      }

      const preparePlayerObject = {
        context: state?.context?.uri || null,
        isPlaying: state?.paused ? false : true,
        currentDuration: state?.duration_ms,
        currentTrack: state?.track_window?.current_track || null,
        currentid: state?.track_window?.current_track?.id || null,
        artists:
          state?.track_window?.current_track?.artists.map(
            (artist: any) => " " + artist?.name,
          ) || "", // string
        nextTracks: state?.track_window?.next_tracks, // array
        previousTracks: state?.track_window?.previous_tracks, // array
        // queue: state?.track_window?.tracks || [],
      };

      localStorage.setItem("playerState", JSON.stringify(state));

      set({ playerState: preparePlayerObject });
    });
  },

  togglePlayback: () => {
    const { player, isPlaying } = get();

    if (!player) {
      console.error("Player not initialized");
      return;
    }

    player.togglePlay();
    set({ isPlaying: !isPlaying });

    // const { isPlaying, currentid, queue } = get();
    // console.log(get().player);
    // if (queue.length === 0) return;
    // if (currentid === null && queue.length > 0) {
    //   set({
    //     isPlaying: true,
    //     currentid: queue[0].id,
    //     currentTrackIndex: 0,
    //   });
    //   return;
    // }
  },

  stopPlayback: () => {
    set({
      isPlaying: false,
      currentid: null,
      currentTrackIndex: -1,
    });
  },

  // * queue related stuff
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
