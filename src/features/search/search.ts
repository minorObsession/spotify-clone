import { StateCreator } from "zustand";
import { StateStore } from "../../state/store";
import { fetchFromSpotify } from "../../state/helpers";
import { TopTrackType } from "../artists/artist";
import { TrackType } from "../tracks/track";
import { AlbumType } from "../albums/album";
import { UserPlaylistType } from "../playlists/playlists";
import { PodcastType, PodcastEpisodeType } from "../podcasts/podcast";
import { AudiobookType } from "../audiobooks/audiobook";
import { AsyncResult, wrapPromiseResult } from "../../types/reusableTypes";
import { SpotifyApi } from "../../spotify.d";

// ! GOTTA MATCH TYPES HERE WITH FPFILTERED
// ! GOTTA MATCH TYPES HERE WITH FPFILTERED
// ! GOTTA MATCH TYPES HERE WITH FPFILTERED
// ! GOTTA MATCH TYPES HERE WITH FPFILTERED
// ! GOTTA MATCH TYPES HERE WITH FPFILTERED
// ! GOTTA MATCH TYPES HERE WITH FPFILTERED
// ! GOTTA MATCH TYPES HERE WITH FPFILTERED

export type SearchFiltersType =
  | "track,artist,album,playlist,show,episode,audiobook"
  | "track"
  | "artist"
  | "album"
  | "playlist"
  | "podcast"
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

export interface SearchResultType {
  searchQuery: string;
  tracks: TrackType[];
  artists: ShortArtistType[];
  albums: AlbumType[];
  playlists: UserPlaylistType[];
  podcasts: PodcastType[];
  episodes: PodcastEpisodeType[];
  audiobooks: AudiobookType[];
  topTracks: TopTrackType[];
}

export type TopResultType = {
  imageUrl: string;
  name: string;
  id: string;
  topTracks: TopTrackType[];
};

export interface SearchSlice {
  searchResults: SearchResultType | null;
  searchFilter: SearchFiltersType;
  topResult: TopResultType | null;

  setSearchFilters: (filterBy: SearchFiltersType) => void;
  setSearchResults: (results: SearchResultType) => void;
  search: (
    query: string,
    offset?: number,
    limit?: number,
  ) => Promise<AsyncResult<SearchResultType>>;
}

export const createSearchSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never], ["zustand/persist", unknown]],
  [],
  SearchSlice
> = (set, get) => ({
  searchResults: null,
  searchFilter: "track,artist,album,playlist,show,episode,audiobook",
  topResult: null,
  // ! implement debounced auto search for production
  setSearchFilters: (filterBy) =>
    set({ searchFilter: filterBy }, undefined, "search/setSearchFilters"),
  setSearchResults: (results) =>
    set({ searchResults: results }, undefined, "search/setSearchResults"),
  search: async (query, offset = 0, limit = 50) => {
    const searchFilter = get().searchFilter;

    return await wrapPromiseResult<SearchResultType>(
      fetchFromSpotify<SpotifyApi.SearchResponse, SearchResultType>({
        endpoint: `search?q=${query}&type=${searchFilter === "podcast" ? "show" : searchFilter}&offset=${offset}&limit=${limit}`,
        cacheName: `search_${query}_${searchFilter}_${offset}`,
        onCacheFound: (data) =>
          set(
            { searchResults: data },
            undefined,
            "search/setSearchResultsFromCache",
          ),
        onDataReceived: (data) =>
          set(
            { searchResults: data },
            undefined,
            "search/setSearchResultsFromAPI",
          ),
        transformFn: async (data: SpotifyApi.SearchResponse) => {
          const transformedData: SearchResultType = {
            searchQuery: query,
            tracks:
              data.tracks?.items
                ?.filter(
                  (track): track is SpotifyApi.TrackObject => track !== null,
                )
                .map((track) => {
                  return {
                    name: track.name ?? "Unknown Track",
                    id: track.id,
                    imageUrl: track.album?.images?.[0]?.url,
                    multipleArtists: track.artists?.length > 1,
                    artists:
                      track.artists?.map((artist) => ({
                        name: artist.name ?? "Unknown Artist",
                        artistId: artist.id,
                      })) ?? [],
                    type: track.type ?? "track",
                    trackDuration: track.duration_ms ?? 0,
                    releaseDate: track.album?.release_date,
                    albumName: track.album?.name ?? "Unknown Album",
                    albumId: track.album?.id,
                  };
                }) ?? [],
            artists:
              data.artists?.items
                ?.filter(
                  (artist): artist is SpotifyApi.ArtistObject =>
                    artist !== null,
                )
                .map((artist) => {
                  return {
                    name: artist.name ?? "Unknown Artist",
                    id: artist.id,
                    imageUrl: artist.images?.[0]?.url,
                    type: artist.type ?? "artist",
                  };
                }) ?? [],
            albums:
              data.albums?.items
                ?.filter(
                  (album): album is SpotifyApi.AlbumObject => album !== null,
                )
                .map((album) => {
                  return {
                    name: album.name ?? "Unknown Album",
                    id: album.id,
                    imageUrl: album.images?.[0]?.url,
                    artists:
                      album.artists?.map((artist) => ({
                        name: artist.name ?? "Unknown Artist",
                        id: artist.id,
                        imageUrl: artist.images?.[0]?.url,
                      })) ?? [],
                    releaseDate: album.release_date,
                    totalTracks: album.total_tracks ?? 0,
                    tracks: [], // We'll need to fetch tracks separately
                  };
                }) ?? [],
            playlists:
              data.playlists?.items
                ?.filter(
                  (playlist): playlist is SpotifyApi.PlaylistObject =>
                    playlist !== null,
                )
                .map((playlist) => {
                  return {
                    name: playlist.name ?? "Unknown Playlist",
                    id: playlist.id,
                    imageUrl: playlist.images[0].url,
                    ownerName: playlist.owner?.display_name ?? "Unknown Owner",
                    ownerId: playlist.owner?.id,
                    type: playlist.type ?? "playlist",
                    trackIds: [], // We'll need to fetch tracks separately
                  };
                }) ?? [],
            podcasts:
              data.shows?.items
                ?.filter((show): show is SpotifyApi.ShowObject => show !== null)
                .map((show) => {
                  return {
                    name: show.name ?? "Unknown Show",
                    id: show.id,
                    description: show.description,
                    imageUrl: show.images?.[0]?.url,
                    publisher: show.publisher ?? "Unknown Publisher",
                    type: show.type ?? "show",
                    episodes: [], // We'll need to fetch episodes separately
                    totalEpisodes: show.total_episodes ?? 0,
                  };
                }) ?? [],
            episodes:
              data.episodes?.items
                ?.filter(
                  (episode): episode is SpotifyApi.EpisodeObject =>
                    episode !== null,
                )
                .map((episode) => {
                  return {
                    name: episode.name ?? "Unknown Episode",
                    id: episode.id,
                    description: episode.description,
                    imageUrl: episode.images?.[0]?.url,
                    durationMs: episode.duration_ms ?? 0,
                    releaseDate: episode.release_date,
                    audioPreviewUrl: episode.audio_preview_url,
                  };
                }) ?? [],
            audiobooks:
              data.audiobooks?.items
                ?.filter(
                  (audiobook): audiobook is SpotifyApi.AudiobookObject =>
                    audiobook !== null,
                )
                .map((audiobook) => {
                  return {
                    name: audiobook.name ?? "Unknown Audiobook",
                    id: audiobook.id,
                    imageUrl: audiobook.images?.[0]?.url,
                    authors:
                      audiobook.authors?.map((author) => ({
                        name: author.name ?? "Unknown Author",
                        id: author.id,
                      })) ?? [],
                    type: audiobook.type ?? "audiobook",
                    tracks: [], // We'll need to fetch tracks separately
                    artists: [], // We'll need to fetch artists separately
                    releaseDate: "", // We'll need to fetch release date separately
                    totalTracks: 0, // We'll need to fetch total tracks separately
                  };
                }) ?? [],
            topTracks: [],
          };

          // If we have an artist in the results, get their top tracks
          if (data.artists?.items && data.artists.items.length > 0) {
            const getTopTracks = get().getTopTracks;
            const topTracks = await getTopTracks(data.artists.items[0].id);
            if (!topTracks.success) return transformedData;
            if (topTracks.data) transformedData.topTracks = topTracks.data;
          }

          return transformedData;
        },
      }).then(async (result) => {
        if (!result) throw new Error("Couldn't fetch search results");

        const topResultToStore: TopResultType = {
          imageUrl: result.artists[0].imageUrl,
          name: result.artists[0].name,
          id: result.artists[0].id,
          topTracks: result.topTracks,
        };
        set({ topResult: topResultToStore }, undefined, "search/setTopResult");
        set({ searchResults: result }, undefined, "search/setSearchResults");

        return result;
      }),
    );
  },
});
