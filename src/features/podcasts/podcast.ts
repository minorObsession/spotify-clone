import { StateStore } from "../../state/store";
import { StateCreator } from "zustand";
import { fetchFromSpotify } from "../../state/helpers";
import { getFromLocalStorage } from "../auth/authHelpers";

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
  addEpisodeToLikedEpisodes: (episode: PodcastEpisodeType) => void;
  getPodcast: (id: string) => Promise<PodcastType>;
  setPodcast: (podcast: PodcastType) => void;
  isEpisodeSaved: (episodeId: string) => boolean;
  initializeLikedEpisodes: () => void;
}

export const createPodcastSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  PodcastSlice
> = (set, get) => ({
  podcast: null,
  likedEpisodes: [],
  setPodcast: (podcast: PodcastType) => set({ podcast }),
  initializeLikedEpisodes: () => {
    const user = get()?.user;
    if (!user) return;

    const data = getFromLocalStorage<PodcastEpisodeType[]>(
      `${user?.username}s_liked_episodes`,
    );
    if (data === null) return;
    set({ likedEpisodes: [...data] });
  },

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
  addEpisodeToLikedEpisodes: (episode: PodcastEpisodeType) => {
    set((state) => ({
      likedEpisodes: [episode, ...state.likedEpisodes],
    }));
  },
  isEpisodeSaved: (episodeId: string) => {
    return (
      get().likedEpisodes?.some((episode) => episode.id === episodeId) || false
    );
  },
});
