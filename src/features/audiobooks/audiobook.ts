import { StateStore } from "../../state/store";
import { StateCreator } from "zustand";
import { fetchFromSpotify } from "../../state/helpers";
import { ShortArtistType } from "../search/search";
import { TopTrackType } from "../artists/artist";

export interface AudiobookType {
  name: string;
  id: string;
  // type: string;
  imageUrl: string;
  tracks: TopTrackType[];
  artists: ShortArtistType[];
  releaseDate: string;
  totalTracks: number;
}

export interface AudiobookSlice {
  audiobook: AudiobookType | null;
  getAudiobook: (id: string) => Promise<AudiobookType>;
  // getAudiobookTracks: (id: string) => Promise<AudiobookTrackType[] | null>;
  setAudiobook: (audiobook: AudiobookType) => void;
}

export const createAudiobookSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  AudiobookSlice
> = (set) => ({
  audiobook: null,
  setAudiobook: (audiobook: AudiobookType) => set({ audiobook }),
  // getAudiobookTracks: async (id: string) => {
  //   console.log("calling getAudiobookTracks");
  //   return await fetchFromSpotify<any, AudiobookTrackType[]>({
  //     endpoint: `audiobooks/${id}/tracks`,
  //     cacheName: `tracks_for_audiobook_${id}`,
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

  getAudiobook: async (id: string) => {
    console.log("get audiobook called");
    try {
      const result = await fetchFromSpotify<any, AudiobookType>({
        endpoint: `audiobooks/${id}`,
        transformFn: async (data) => {
          // const tracks = await get().getAudiobookTracks(id);

          // if (!tracks || tracks === null)
          //   throw new Error("Audiobook tracks could not be fetched");

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
        onDataReceived: (data) => {
          set({ audiobook: data });
        },
      });
      return result;
    } catch (error) {
      console.error("Error fetching audiobook", error);
      throw error;
    }
  },
});
