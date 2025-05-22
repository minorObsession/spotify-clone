import { StateStore } from "../../state/store";
import { StateCreator } from "zustand";
import { TrackType } from "../tracks/track";
import { fetchFromSpotify } from "../../state/helpers";

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

  getTopTracks: async (id: string) => {
    console.log("calling getTopTracks");
    return await fetchFromSpotify<any, TopTrackType[]>({
      endpoint: `artists/${id}/top-tracks`,
      cacheName: `top_tracks_for_${id}`,
      transformFn: (data) =>
        data.tracks?.map((track: any) => ({
          name: track.name,
          id: track.id,
          imageUrl: track.album.images[0].url,
          trackDuration: track.duration_ms,
          artists: track.artists.map((artist: any) => ({
            name: artist.name,
            artistId: artist.id,
          })),
        })),
    });
  },

  getArtist: async (id: string) => {
    console.log("calling getArtist", id);
    return await fetchFromSpotify<any, ArtistType>({
      endpoint: `artists/${id}`,
      cacheName: `artist_${id}`,
      transformFn: async (data) => {
        const topTracks = await get().getTopTracks(id);

        if (!topTracks || topTracks === null)
          throw new Error("topTracks could not be fetched");

        return {
          name: data.name,
          genres: data.genres,
          id: data.id,
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
