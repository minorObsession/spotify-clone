import { StateStore } from "../../state/store";
import { StateCreator } from "zustand";
import { TrackType } from "../tracks/track";
import { fetchFromSpotify } from "../../state/helpers";
import { AsyncResult, wrapPromiseResult } from "../../types/reusableTypes";

export interface ArtistType {
  name: string;
  genres: string[];
  id: string;
  type: string;
  numFollowers: number;
  imageUrl: string;
  topTracks: TopTrackType[];
}

export type TopTrackType = Omit<
  TrackType,
  | "albumName"
  | "multipleArtists"
  | "albumId"
  | "type"
  | "topTracks"
  | "releaseDate"
>;
export interface ArtistSlice {
  // ! get partial types
  artist: ArtistType | null;
  getArtist: (id: string) => Promise<AsyncResult<ArtistType | null>>;
  getTopTracks: (id: string) => Promise<AsyncResult<TopTrackType[] | null>>;
}

export const createArtistSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never], ["zustand/persist", unknown]],
  [],
  ArtistSlice
> = (set, get) => ({
  artist: null,

  getTopTracks: async (id: string) => {
    return await wrapPromiseResult<TopTrackType[]>(
      fetchFromSpotify<SpotifyApi.ArtistsTopTracksResponse, TopTrackType[]>({
        endpoint: `artists/${id}/top-tracks`,
        cacheName: `top_tracks_for_${id}`,
        transformFn: (data) =>
          data.tracks?.map((track: SpotifyApi.TrackObjectFull) => ({
            name: track.name,
            id: track.id,
            imageUrl: track.album?.images?.[0]?.url ?? "",
            trackDuration: track.duration_ms,
            artists: track.artists?.map(
              (artist: SpotifyApi.ArtistObjectSimplified) => ({
                name: artist.name,
                artistId: artist.id,
              }),
            ),
          })),
      }),
    );
  },

  getArtist: async (id: string) => {
    console.log("calling getArtist", id);
    return await wrapPromiseResult<ArtistType>(
      fetchFromSpotify<SpotifyApi.ArtistObjectFull, ArtistType>({
        endpoint: `artists/${id}`,
        cacheName: `artist_${id}`,
        transformFn: async (data) => {
          const topTracks = await get().getTopTracks(id);

          return {
            name: data.name,
            genres: data.genres,
            id: data.id,
            type: data.type,
            numFollowers: data.followers.total,
            imageUrl: data.images[0].url,
            topTracks: topTracks.success ? topTracks.data || [] : [],
          };
        },
        onCacheFound: (data) => {
          set({ artist: data }, undefined, "artist/setArtistFromCache");
        },
        onDataReceived: (data) => {
          set({ artist: data }, undefined, "artist/setArtistFromAPI");
        },
      }),
    );
  },
});
