import { StateCreator } from "zustand";
import { StateStore } from "../../state/store";
import { TrackType } from "../tracks/track";
import { fetchFromSpotify } from "../../state/helpers";
import { getSpotifyDeviceId } from "./spotifyPlayer";
import { makeRequestBody } from "./playbackHelpers";

// todo / ideas
// what are the different events of the player for?
// state changed - use it to display progress of track
/* player.addListener('player_state_changed', ({
  position,
  duration,
  track_window: { current_track }
}) => {
  console.log('Currently Playing', current_track);
  console.log('Position in Song', position);
  console.log('Duration of Song', duration);
}); */

export interface Album {
  id: string;
  uri: string;
  name: string;
  image: string;
}
export interface CurrentTrack {
  id: string;
  type: string;
  name: string;
  duration: number;
  artists: Record<string, string>[];
  album: Album;
}

export interface PlayerType {
  isPlaying: boolean;
  context: string | null;
  playbackId: string | null;
  currentTrack: CurrentTrack | null;
  progressMs: number;
  nextTracks: any[];
  previousTracks: any[];
}
export interface PlaybackSlice {
  isPlaying: boolean;
  currentId: string | null;
  // currentTrackIndex: number;
  queue: TrackType[];
  isShuffled: boolean;
  originalQueue: TrackType[];
  myDevices: DeviceType[];
  player: Spotify.Player | null;
  deviceId: string | null;
  playerState: PlayerType | null;

  getPlayerState: () => Promise<void>;
  getDevices: () => void;
  togglePlayback: () => void;
  // stopPlayback: () => void;
  // nextTrack: () => void;
  // previousTrack: () => void;
  // shuffle: () => void;
  // setQueue: (tracks: TrackType[], startIndex?: number) => void;
  updateUIOnStateChange: (newState: any) => void;
  playTrack: (
    uri: string,
    dataType: "artist" | "album" | "playlist" | "track",
  ) => Promise<void>;
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
  player: null,
  playerState: JSON.parse(localStorage.getItem("player_state") || "null"),

  // ! derive from player!!!!
  isPlaying: false,
  currentId: null,
  // currentTrackIndex: get().playerState?.currentTrack?.id || -1,

  queue: [],
  isShuffled: false,
  originalQueue: [],
  myDevices: [],

  deviceId: window.spotifyDeviceId,
  // ! define player type

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
      set({ isPlaying: true });
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
  updateUIOnStateChange: (newState) => {
    const { player } = get();

    if (!player) {
      console.error("Player not initialized");
      return;
    }

    const state = await player.getCurrentState();

    if (!state) {
      console.error("Unable to fetch player state");
      return;
    }

    if (
      newState.track_window.current_track.id !==
      state.track_window.current_track.id
    ) {
      get().getPlayerState();
    }

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

    const state: any = await player.getCurrentState();

    const preparePlayerObject: PlayerType = {
      isPlaying: state?.paused ? false : true,
      context: state?.context?.uri || null,
      playbackId: state?.playback_id || null,
      nextTracks: state?.track_window?.next_tracks, // array
      previousTracks: state?.track_window?.previous_tracks, // array
      progressMs: state.position || 0,
      currentTrack: state
        ? {
            id: state?.track_window?.current_track.id,
            type: state?.track_window?.current_track.type,
            name: state?.track_window?.current_track.name,
            duration: state?.track_window?.current_track.duration_ms,
            artists:
              state?.track_window?.current_track?.artists.map((artist: any) => {
                return {
                  artistId: artist.uri?.split(":")[2],
                  name: artist.name,
                };
              }) || [],
            album: {
              id:
                state?.track_window?.current_track.album?.uri?.split(":")[2] ||
                "",
              uri: state?.track_window?.current_track.album?.uri || "",
              name: state?.track_window?.current_track.album?.name || "",
              image:
                state?.track_window?.current_track.album?.images?.[0]?.url ||
                "",
            },
          }
        : null,
    };

    localStorage.setItem("playerState", JSON.stringify(state));

    localStorage.setItem("player_state", JSON.stringify(preparePlayerObject));

    set({ playerState: preparePlayerObject });
  },

  togglePlayback: async () => {
    const { player, isPlaying } = get();

    if (!player) {
      console.error("Player not initialized");
      return;
    }

    player.togglePlay();

    // Update player state in local storage (progress)
    const state: any = await player.getCurrentState();
    const { playerState } = get();

    set({ isPlaying: !isPlaying });

    const modifiedState = {
      ...playerState,
      paused: !isPlaying,
      progressMs: state.position,
    };

    localStorage.setItem("player_state", JSON.stringify(modifiedState));

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
  // getVolume: ()=>{}
  // setVolume: ()=>{}

  // stopPlayback: () => {
  //   set({
  //     isPlaying: false,
  //     currentid: null,
  //     currentTrackIndex: -1,
  //   });
  // },

  // * queue related stuff
  // nextTrack: () => {
  //   const { queue, currentTrackIndex } = get();

  //   if (queue.length === 0) return;

  //   const nextIndex = (currentTrackIndex + 1) % queue.length;
  //   const nextTrack = queue[nextIndex];

  //   set({
  //     currentid: nextTrack.id,
  //     currentTrackIndex: nextIndex,
  //   });
  // },

  // previousTrack: () => {
  //   const { queue, currentTrackIndex } = get();

  //   if (queue.length === 0) return;

  //   const previousIndex =
  //     currentTrackIndex <= 0 ? queue.length - 1 : currentTrackIndex - 1;
  //   const previousTrack = queue[previousIndex];

  //   set({
  //     currentid: previousTrack.id,
  //     currentTrackIndex: previousIndex,
  //   });
  // },

  // shuffle: () => {
  //   const { queue, currentid, isShuffled, originalQueue } = get();

  //   if (queue.length <= 1) return;

  //   if (isShuffled) {
  //     set({
  //       queue: [...originalQueue],
  //       isShuffled: false,
  //       currentTrackIndex: currentid
  //         ? originalQueue.findIndex((track) => track.id === currentid)
  //         : -1,
  //     });
  //   } else {
  //     const shuffledQueue = [...queue];
  //     for (let i = shuffledQueue.length - 1; i > 0; i--) {
  //       const j = Math.floor(Math.random() * (i + 1));
  //       [shuffledQueue[i], shuffledQueue[j]] = [
  //         shuffledQueue[j],
  //         shuffledQueue[i],
  //       ];
  //     }

  //     set({
  //       queue: shuffledQueue,
  //       originalQueue: [...queue],
  //       isShuffled: true,
  //       currentTrackIndex: currentid
  //         ? shuffledQueue.findIndex((track) => track.id === currentid)
  //         : -1,
  //     });
  //   }
  // },

  // setQueue: (tracks, startIndex = 0) => {
  //   if (!tracks || tracks.length === 0) return;

  //   const validIndex = Math.max(0, Math.min(startIndex, tracks.length - 1));
  //   const startTrack = tracks[validIndex];

  //   set({
  //     isPlaying: true,
  //     currentid: startTrack.id,
  //     currentTrackIndex: validIndex,
  //     queue: tracks,
  //     isShuffled: false,
  //     originalQueue: [...tracks],
  //   });
  // },

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
