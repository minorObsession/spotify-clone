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
  podcast: PodcastType | null;
  likedEpisodes: PodcastEpisodeType[];
  getPodcast: (id: string) => Promise<PodcastType>;
  addEpisodeToLikedEpisodes: (episode: PodcastEpisodeType) => void;
  removeEpisodeFromLikedEpisodes: (episodeId: string) => void;
  isEpisodeSaved: (episodeId: string) => boolean;
}

export const createPodcastSlice: StateCreator<
  PodcastSlice,
  [["zustand/devtools", never], ["zustand/persist", unknown]],
  [],
  PodcastSlice
> = (set, get) => ({
  podcast: null,
  likedEpisodes: [],

  getPodcast: async (id: string) => {
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
          set({ podcast: data }, undefined, "podcast/setPodcastFromCache");
        },
        onDataReceived: (data) => {
          set({ podcast: data }, undefined, "podcast/setPodcastFromAPI");
        },
      });
      return result;
    } catch (error) {
      console.error("Error fetching podcast", error);
      throw error;
    }
  },
  addEpisodeToLikedEpisodes: (episode: PodcastEpisodeType) => {
    const isEpisodeSaved = get().likedEpisodes.some(
      (ep) => ep.id === episode.id,
    );

    if (isEpisodeSaved) {
      console.log("already saved!! returning..");
      return;
    }

    set(
      (state) => ({
        likedEpisodes: [episode, ...state.likedEpisodes],
      }),
      undefined,
      "podcast/addEpisodeToLikedEpisodes",
    );
  },
  removeEpisodeFromLikedEpisodes: (episodeId: string) => {
    const episodeToRemove = get().likedEpisodes.find(
      (episode) => episode.id === episodeId,
    );
    if (!episodeToRemove) return;

    set(
      {
        likedEpisodes: get().likedEpisodes.filter((ep) => ep.id !== episodeId),
      },
      undefined,
      "podcast/removeEpisodeFromLikedEpisodes",
    );
  },
  isEpisodeSaved: (episodeId: string) => {
    return (
      get().likedEpisodes?.some((episode) => episode?.id === episodeId) || false
    );
  },
});
