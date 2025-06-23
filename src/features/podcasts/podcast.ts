import { StateCreator } from "zustand";
import { StateStore } from "../../state/store";
import { fetchFromSpotify } from "../../state/helpers";
import { AsyncResult, wrapPromiseResult } from "../../types/reusableTypes";

export interface PodcastEpisodeType {
  name: string;
  id: string;
  description: string;
  imageUrl: string;
  durationMs: number;
  releaseDate: string;
  audioPreviewUrl: string | null;
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
  getPodcast: (id: string) => Promise<AsyncResult<PodcastType>>;
  addEpisodeToLikedEpisodes: (episode: PodcastEpisodeType) => void;
  removeEpisodeFromLikedEpisodes: (episodeId: string) => void;
  isEpisodeSaved: (episodeId: string) => boolean;
}

export const createPodcastSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never], ["zustand/persist", unknown]],
  [],
  PodcastSlice
> = (set, get) => ({
  podcast: null,
  likedEpisodes: [],

  getPodcast: async (id: string) => {
    return await wrapPromiseResult<PodcastType>(
      fetchFromSpotify<SpotifyApi.ShowObjectFull, PodcastType>({
        endpoint: `shows/${id}`,
        transformFn: async (data) => {
          return {
            name: data.name,
            id: data.id,
            description: data.description ?? "",
            imageUrl: data.images?.[0]?.url ?? "",
            publisher: data.publisher ?? "",
            totalEpisodes: data.total_episodes ?? 0,
            episodes: data.episodes.items.map(
              (episode: SpotifyApi.EpisodeObjectSimplified) => ({
                name: episode.name ?? "",
                id: episode.id ?? "",
                description: episode.description ?? "",
                imageUrl: episode.images?.[0]?.url ?? "",
                durationMs: episode.duration_ms ?? 0,
                releaseDate: episode.release_date ?? "",
                audioPreviewUrl: episode.audio_preview_url ?? "",
              }),
            ),
          };
        },
        onDataReceived: (data) => {
          set({ podcast: data }, undefined, "podcast/setPodcastFromAPI");
        },
      }),
    );
  },
  addEpisodeToLikedEpisodes: (episode: PodcastEpisodeType) => {
    const likedEpisodes = get().likedEpisodes;
    const isEpisodeSaved = likedEpisodes.some((ep) => ep.id === episode.id);

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
    const likedEpisodes = get().likedEpisodes;
    const episodeToRemove = likedEpisodes.find(
      (episode) => episode.id === episodeId,
    );
    if (!episodeToRemove) return;

    set(
      {
        likedEpisodes: likedEpisodes.filter((ep) => ep.id !== episodeId),
      },
      undefined,
      "podcast/removeEpisodeFromLikedEpisodes",
    );
  },
  isEpisodeSaved: (episodeId: string) => {
    const likedEpisodes = get().likedEpisodes;
    return likedEpisodes?.some((episode) => episode?.id === episodeId) || false;
  },
});
