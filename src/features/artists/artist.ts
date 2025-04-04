import { StateStore } from "../../state/store";
import { StateCreator } from "zustand";
import { TrackType } from "../tracks/track";
import { fetchFromSpotify } from "../../state/helpers";

export interface ArtistType {
  artistName: string;
  genres: string[];
  artistID: string;
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
  | "artists"
  | "topTracks"
  | "releaseDate"
>;
export interface ArtistSlice {
  // ! get partial types
  artist: ArtistType | null;

  getArtist: (id: string) => Promise<ArtistType | null>;
  getTopTracks: (id: string) => Promise<TopTrackType[] | null>;
}

export const createArtistSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  ArtistSlice
> = (set, get) => ({
  artist: null,

  getTopTracks: async (artistId: string) => {
    return await fetchFromSpotify<any, TopTrackType[]>({
      endpoint: `artists/${artistId}/top-tracks`,
      cacheName: `top_tracks_for_${artistId}`,
      transformFn: (data) =>
        data.tracks.map((track: any) => ({
          name: track.name,
          trackId: track.id,
          imageUrl: track.album.images[0].url,
          trackDuration: track.duration_ms,
        })),
    });
  },
  getArtist: async (artistId: string) => {
    return await fetchFromSpotify<any, ArtistType>({
      endpoint: `artists/${artistId}`,
      cacheName: `artist_${artistId}`,
      transformFn: async (data) => {
        const topTracks = await get().getTopTracks(artistId);

        if (!topTracks || topTracks === null)
          throw new Error("topTracks could not be fetched");

        return {
          artistName: data.name,
          genres: data.genres,
          artistID: data.id,
          type: data.type,
          numFollowers: data.followers.total,
          imageUrl: data.images[0].url,
          topTracks,
        };
      },
      onCacheFound: (data) => {
        set({ artist: data });
      },
      onDataReceived: (data) => {
        set({ artist: data });
      },
    });
  },
});
