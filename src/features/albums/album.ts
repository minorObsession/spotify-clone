import { StateStore } from "../../state/store";
import { StateCreator } from "zustand";
import { fetchFromSpotify } from "../../state/helpers";
import { ShortArtistType } from "../search/search";
import { TopTrackType } from "../artists/artist";

export interface AlbumType {
  name: string;
  id: string;
  // type: string;
  imageUrl: string;
  tracks: TopTrackType[];
  artists: ShortArtistType[];
  releaseDate: string;
  totalTracks: number;
}

export interface AlbumSlice {
  album: AlbumType | null;
  getAlbum: (id: string) => Promise<AlbumType>;
  // getAlbumTracks: (id: string) => Promise<AlbumTrackType[] | null>;
  setAlbum: (album: AlbumType) => void;
}

export const createAlbumSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  AlbumSlice
> = (set, get) => ({
  album: null,
  setAlbum: (album: AlbumType) => set({ album }, undefined, "album/setAlbum"),
  // getAlbumTracks: async (id: string) => {
  //   console.log("calling getAlbumTracks");
  //   return await fetchFromSpotify<any, AlbumTrackType[]>({
  //     endpoint: `albums/${id}/tracks`,
  //     cacheName: `tracks_for_album_${id}`,
  //     transformFn: (data) =>
  //       data.items?.map((track: any) => ({
  //         name: track.name,
  //         id: track.id,
  //         trackDuration: track.duration_ms,
  //         artists: track.artists.map((artist: any) => ({
  //           name: artist.name,
  //           artistId: artist.id,
  //         })),
  //       })),
  //   });
  // },

  getAlbum: async (id: string) => {
    console.log("get album called");
    try {
      const result = await fetchFromSpotify<any, AlbumType>({
        endpoint: `albums/${id}`,
        cacheName: `album_${id}`,
        transformFn: async (data) => {
          // const tracks = await get().getAlbumTracks(id);

          // if (!tracks || tracks === null)
          //   throw new Error("Album tracks could not be fetched");

          return {
            name: data.name,
            id: data.id,
            // type: data.type,
            imageUrl: data.images[0].url,
            artists: data.artists.map((artist: any) => ({
              name: artist.name,
              id: artist.id,
            })),
            releaseDate: data.release_date,
            totalTracks: data.total_tracks,
            tracks: data.tracks.items.map((track: any) => ({
              name: track.name,
              id: track.id,
              trackDuration: track.duration_ms,
              artists: track.artists.map((artist: any) => ({
                name: artist.name,
                id: artist.id,
              })),
            })),
          };
        },
        onCacheFound: (data) => {
          set({ album: data }, undefined, "album/setAlbumFromCache");
        },
        onDataReceived: (data) => {
          set({ album: data }, undefined, "album/setAlbumFromAPI");
        },
      });
      return result;
    } catch (error) {
      console.error("Error fetching album", error);
      throw error;
    }
  },
});
