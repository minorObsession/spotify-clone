import { StateCreator } from "zustand";

import { StateStore } from "../../state/store";
import { fetchFromSpotify } from "../../state/helpers";
import { AsyncResult, wrapPromiseResult } from "../../types/reusableTypes";

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
  getTrack: (id: string) => Promise<AsyncResult<TrackType>>;
}

export const createTrackSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never], ["zustand/persist", unknown]],
  [],
  TrackSlice
> = (set) => ({
  track: null,
  getTrack: async (id: string) => {
    return await wrapPromiseResult<TrackType>(
      fetchFromSpotify<SpotifyApi.TrackObjectFull, TrackType>({
        endpoint: `tracks/${id}`,
        transformFn: (data) => ({
          name: data.name,
          type: data.type,
          id: data.id,
          imageUrl: data.album.images[0].url,
          multipleArtists: data.artists.length > 1,
          artists: data.artists.map(
            (artist: SpotifyApi.ArtistObjectSimplified) => ({
              name: artist.name ?? "",
              id: artist.id ?? "",
            }),
          ),
          trackDuration: data.duration_ms,
          releaseDate: data.album.release_date,
          albumName: data.album.name,
          albumId: data.album.id,
        }),
        onDataReceived: (data) => {
          set({ track: data }, undefined, "track/setTrackFromAPI");
        },
      }),
    );
  },
});
