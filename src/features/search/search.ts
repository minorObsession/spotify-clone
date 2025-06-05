import { StateCreator } from "zustand";
import { fetchFromSpotify } from "../../state/helpers";
import { TopTrackType } from "../artists/artist";

export type SearchFiltersType =
  | "track,artist,album,playlist,show,episode,audiobook"
  | "track"
  | "artist"
  | "album"
  | "playlist"
  | "show"
  | "episode"
  | "audiobook";

export interface ShortArtistType {
  name: string;
  imageUrl: string;
  id: string;
}

export interface ShortAlbumType {
  id: string;
  name: string;
  imageUrl: string | undefined;
  releaseYear: string;
  artists: {
    name: string;
    id: string;
  }[];
}

export interface ShortPlaylistType {
  name: string;
  imageUrl: string;
  id: string;
}

export interface ShortPodcastType {
  name: string;
  imageUrl: string;
  id: string;
  publisher: string;
}

export interface ShortEpisodeType {
  name: string;
  imageUrl: string;
  id: string;
  releaseDate: string;
}

export interface ShortAuthorType {
  name: string;
  id: string;
}

export interface ShortAudiobookType {
  name: string;
  imageUrl: string;
  id: string;
  authors: ShortAuthorType[];
}

// ! fix these any types!!!
export type SearchResultType = {
  artists: ShortArtistType[];
  albums: ShortAlbumType[];
  playlists: ShortPlaylistType[];
  podcasts: ShortPodcastType[];
  episodes: ShortEpisodeType[];
  audiobooks: ShortAudiobookType[];
};

export type TopResultType = {
  imageUrl: string;
  name: string;
  id: string;
  topTracks: TopTrackType[];
};

export interface SearchSlice {
  searchResults: SearchResultType | null;
  searchFilters: SearchFiltersType;
  topResult: TopResultType | null;
  searchOffset: number;
  searchLimit: number;
  setSearchFilters: (filterBy: SearchFiltersType) => void;
  search: (query: string) => Promise<SearchResultType>;
}

export const createSearchSlice: StateCreator<
  SearchSlice,
  [["zustand/devtools", never], ["zustand/persist", unknown]],
  [],
  SearchSlice
> = (set, get) => ({
  searchResults: null,
  searchFilters: "track,artist,album,playlist,show,episode,audiobook",
  topResult: null,
  searchOffset: 0,
  searchLimit: 20,
  // ! implement debounced auto search for production
  setSearchFilters: (filterBy) =>
    set({ searchFilters: filterBy }, undefined, "search/setSearchFilters"),
  search: async (query) => {
    try {
      const { searchOffset, searchLimit, searchFilters } = get();

      const result = await fetchFromSpotify<any, SearchResultType>({
        endpoint: `search?q=${query}&type=${searchFilters}&offset=${searchOffset}&limit=${searchLimit}`,
        cacheName: `search_${query}`,
        onCacheFound: (data) =>
          set(
            { searchResults: data },
            undefined,
            "search/setSearchResultsFromCache",
          ),
        transformFn: (data: any) => ({
          artists: data.artists?.items
            .filter(
              (artist: any) =>
                artist && artist.name && artist.images?.[0]?.url && artist.id,
            )
            .map((artist: any) => ({
              name: artist.name,
              imageUrl: artist.images[0].url,
              id: artist.id,
            })),
          albums: data.albums?.items
            .filter(
              (album: any) =>
                album && album.name && album.release_date && album.artists,
            )
            .map((album: any) => ({
              id: album.id,
              name: album.name,
              imageUrl: album.images?.[0]?.url,
              releaseYear: album.release_date.split("-")[0],
              artists: album.artists
                .filter((artist: any) => artist && artist.name && artist.id)
                .map((artist: any) => ({
                  name: artist.name,
                  id: artist.id,
                })),
            })),
          playlists: data.playlists?.items
            .filter(
              (playlist: any) =>
                playlist &&
                playlist.name &&
                playlist.images?.[0]?.url &&
                playlist.id,
            )
            .map((playlist: any) => ({
              name: playlist.name,
              imageUrl: playlist.images[0].url,
              id: playlist.id,
            })),
          podcasts: data.shows?.items
            .filter(
              (podcast: any) =>
                podcast &&
                podcast.name &&
                podcast.images?.[0]?.url &&
                podcast.id &&
                podcast.publisher,
            )
            .map((podcast: any) => ({
              name: podcast.name,
              imageUrl: podcast.images[0].url,
              id: podcast.id,
            })),
          episodes: data.episodes?.items
            .filter(
              (episode: any) =>
                episode &&
                episode.name &&
                episode.images?.[0]?.url &&
                episode.id,
            )
            .map((episode: any) => ({
              name: episode.name,
              imageUrl: episode.images[0].url,
              id: episode.id,
              releaseDate: episode.release_date,
            })),
          audiobooks: data.audiobooks?.items
            .filter(
              (audiobook: any) =>
                audiobook &&
                audiobook.name &&
                audiobook.images?.[0]?.url &&
                audiobook.id,
            )
            .map((audiobook: any) => ({
              name: audiobook.name,
              imageUrl: audiobook.images[0].url,
              id: audiobook.id,
              authors:
                audiobook.authors
                  ?.filter((author: any) => author && author.name && author.id)
                  .map((author: any) => ({
                    name: author.name,
                    id: author.id,
                  })) || [],
            })),
        }),
        onDataReceived: (data) => {
          set(
            { searchResults: data },
            undefined,
            "search/setSearchResultsFromAPI",
          );
        },
      });

      let topTracks;
      if (result.artists.length > 0) {
        // call top tracks for 1st artist
        topTracks = await get().getTopTracks(result.artists[0].id);
      }

      if (!topTracks) return result;

      const topResultToStore: TopResultType = {
        imageUrl: result.artists[0].imageUrl,
        name: result.artists[0].name,
        id: result.artists[0].id,
        topTracks,
      };
      set({ topResult: topResultToStore }, undefined, "search/setTopResult");
      set({ searchResults: result }, undefined, "search/setSearchResults");

      return result;
    } catch (err) {
      console.error("❌🛑 search error:", err);
      throw err;
    }
  },
});
