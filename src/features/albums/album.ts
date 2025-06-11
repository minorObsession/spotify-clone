import { StateStore } from "../../state/store";
import { StateCreator } from "zustand";
import { fetchFromSpotify } from "../../state/helpers";
import { ShortArtistType } from "../search/search";
import { TopTrackType } from "../artists/artist";
import { AsyncResult, wrapPromiseResult } from "../../types/reusableTypes";

export interface AlbumType {
  name: string;
  id: string;
  imageUrl: string;
  tracks: TopTrackType[];
  artists: Omit<ShortArtistType, "imageUrl">[];
  releaseDate: string;
  totalTracks: number;
}

export interface AlbumSlice {
  album: AlbumType | null;
  getAlbum: (id: string) => Promise<AsyncResult<AlbumType>>;
  // getAlbumTracks: (id: string) => Promise<AlbumTrackType[] | null>;
}

export const createAlbumSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never], ["zustand/persist", unknown]],
  [],
  AlbumSlice
> = (set) => ({
  album: null,
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
    return await wrapPromiseResult(
      fetchFromSpotify<SpotifyApi.AlbumObjectFull, AlbumType>({
        endpoint: `albums/${id}`,
        cacheName: `album_${id}`,
        transformFn: async (data) => {
          // const tracks = await get().getAlbumTracks(id);

          // if (!tracks || tracks === null)
          //   throw new Error("Album tracks could not be fetched");

          return {
            name: data.name,
            id: data.id,
            imageUrl: data.images[0].url,
            artists: data.artists.map(
              (artist: SpotifyApi.ArtistObjectSimplified) => ({
                name: artist.name,
                id: artist.id,
              }),
            ),
            releaseDate: data.release_date,
            totalTracks: data.total_tracks,
            tracks: data.tracks.items.map(
              (track: SpotifyApi.TrackObjectSimplified) => ({
                name: track.name,
                id: track.id,
                trackDuration: track.duration_ms,
                imageUrl: data.images[0].url,
                artists: track.artists.map(
                  (artist: SpotifyApi.ArtistObjectSimplified) => ({
                    name: artist.name,
                    id: artist.id,
                  }),
                ),
              }),
            ),
          };
        },
        onCacheFound: (data) => {
          set({ album: data }, undefined, "album/setAlbumFromCache");
        },
        onDataReceived: (data) => {
          set({ album: data }, undefined, "album/setAlbumFromAPI");
        },
      }),
    );
  },
});
