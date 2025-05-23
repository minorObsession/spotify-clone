import { StateStore } from "../../state/store";
import { StateCreator } from "zustand";
import { fetchFromSpotify } from "../../state/helpers";

export interface PodcastEpisodeType {
  name: string;
  id: string;
  description: string;
  imageUrl: string;
  durationMs: number;
  releaseDate: string;
  audioPreviewUrl: string;
}

export interface PodcastType {
  name: string;
  id: string;
  description: string;
  imageUrl: string;
  episodes: PodcastEpisodeType[];
  publisher: string;
  totalEpisodes: number;
}

export interface PodcastSlice {
  podcast: PodcastType;
  getPodcast: (id: string) => Promise<PodcastType>;
  setPodcast: (podcast: PodcastType) => void;
}

export const createPodcastSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  podcastSlice
> = (set, get) => ({
  podcast: null,
  setPodcast: (podcast: PodcastType) => set({ podcast }),
  getPodcast: async (id: string) => {
    console.log("get podcast called");
    try {
      const result = await fetchFromSpotify<any, PodcastType>({
        endpoint: `shows/${id}`,
        cacheName: `podcast_${id}`,
        transformFn: async (data) => {
          return {
            name: data.name,
            id: data.id,
            description: data.description,
            imageUrl: data.images[0].url,
            publisher: data.publisher,
            totalEpisodes: data.total_episodes,
            episodes: data.episodes.items.map((episode: any) => ({
              name: episode.name,
              id: episode.id,
              description: episode.description,
              imageUrl: episode.images[0].url,
              durationMs: episode.duration_ms,
              releaseDate: episode.release_date,
              audioPreviewUrl: episode.audio_preview_url,
            })),
          };
        },
        onCacheFound: (data) => {
          set({ podcast: data });
        },
        onDataReceived: (data) => {
          set({ podcast: data });
        },
      });
      return result;
    } catch (error) {
      console.error("Error fetching podcast", error);
      throw error;
    }
  },
});
