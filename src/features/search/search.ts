import { StateCreator } from "zustand";
import { StateStore } from "../../state/store";
import { fetchFromSpotify } from "../../state/helpers";
import { TopTrackType } from "../artists/artist";

export type SearchFilters =
  | "All"
  | "Tracks"
  | "Artists"
  | "Albums"
  | "Playlists"
  | "Shows"
  | "Episodes"
  | "Audiobooks";

interface ShortArtistType {
  name: string;
  imageUrl: string;
  id: string;
}

interface ShortAlbumType {
  name: string;
  imageUrl: string | undefined;
  releaseYear: string;
  artists: {
    name: string;
    id: string;
  }[];
}

interface ShortPlaylistType {
  name: string;
  imageUrl: string;
  id: string;
}

interface ShortShowType {
  name: string;
  imageUrl: string;
  id: string;
}

interface ShortEpisodeType {
  name: string;
  imageUrl: string;
  id: string;
  releaseDate: string;
}

interface ShortAuthorType {
  name: string;
  id: string;
}

interface ShortAudiobookType {
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
  shows: ShortShowType[];
  episodes: ShortEpisodeType[];
  audiobooks: ShortAudiobookType[];
};

export type TopResultType = {
  imageUrl: string;
  artistName: string;
  artistId: string;
  topTracks: TopTrackType[];
};

export interface SearchSlice {
  searchResults: SearchResultType;
  searchFilters: SearchFilters;
  setSearchFilters: (filterBy: SearchFilters) => void;
  topResult: null | TopResultType;
  searchOffset: number;
  searchLimit: number;
  search: (query: string, type?: string) => void;
}

export const createSearchSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  SearchSlice
> = (set, get) => ({
  searchResults: {
    artists: [],
    albums: [],
    playlists: [],
    shows: [],
    episodes: [],
    audiobooks: [],
  },
  searchFilters: "All",
  setSearchFilters: (filterBy) => set({ searchFilters: filterBy }),
  topResult: null,
  searchOffset: 0,
  searchLimit: 5,
  // ! implement debounced auto search for production
  search: async (query, type) => {
    const { searchOffset, searchLimit, searchFilters } = get();

    await fetchFromSpotify<any, SearchResultType>({
      endpoint: `search?q=${query}&type=${type || searchFilters}&offset=${searchOffset}&limit=${searchLimit}`,
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
        shows: data.shows?.items
          .filter(
            (podcast: any) =>
              podcast && podcast.name && podcast.images?.[0]?.url && podcast.id,
          )
          .map((podcast: any) => ({
            name: podcast.name,
            imageUrl: podcast.images[0].url,
            id: podcast.id,
          })),
        episodes: data.episodes?.items
          .filter(
            (episode: any) =>
              episode && episode.name && episode.images?.[0]?.url && episode.id,
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
        set({ searchResults: data });
      },
    });
  },
});
