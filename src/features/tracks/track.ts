import { StateCreator } from "zustand";
// import { getFromLocalStorage } from "../auth/authHelpers";
// import { AccessTokenType } from "../auth/Auth";
import { StateStore } from "../../state/store";
import { fetchFromSpotify } from "../../state/helpers";

export interface TrackType {
  name: string;
  id: string;
  imageUrl: string;
  multipleArtists: boolean;
  artists: Record<string, string>[];
  type: string;
  trackDuration: number;
  releaseDate: string;
  albumName: string;
  albumId: string;
}

export interface TrackSlice {
  // ! get partial types
  track: TrackType | null;
  getTrack: (id: string) => Promise<TrackType | null>;
}

export const createTrackSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never], ["zustand/persist", unknown]],
  [],
  TrackSlice
> = (set) => ({
  track: null,
  getTrack: async (id: string) => {
    return await fetchFromSpotify<any, TrackType>({
      endpoint: `tracks/${id}`,
      cacheName: `track_${id}`,
      transformFn: (data) => ({
        // uri: data.uri,
        name: data.name,
        type: data.type,
        id: data.id,
        imageUrl: data.album.images[0].url,
        multipleArtists: data.artists.length > 1,
        artists: data.artists.map((artist: any) => ({
          name: artist.name,
          id: artist.id,
        })),
        trackDuration: data.duration_ms,
        releaseDate: data.album.release_date,
        albumName: data.album.name,
        albumId: data.album.id,
      }),
      onCacheFound: (data) => {
        set({ track: data }, undefined, "track/setTrackFromCache");
      },
      onDataReceived: (data) => {
        set({ track: data }, undefined, "track/setTrackFromAPI");
      },
    });
  },
});
