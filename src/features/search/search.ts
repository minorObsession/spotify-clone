import { StateCreator } from "zustand";
import { StateStore } from "../../state/store";
import { fetchFromSpotify } from "../../state/helpers";
import { TopTrackType } from "../artists/artist";
import { TrackType } from "../tracks/track";
import { AlbumType } from "../albums/album";
import { UserPlaylistType } from "../playlists/playlists";
import { PodcastType, PodcastEpisodeType } from "../podcasts/podcast";
import { AudiobookType } from "../audiobooks/audiobook";

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

export interface SearchResultType {
  tracks?: TrackType[];
  artists?: ShortArtistType[];
  albums?: AlbumType[];
  playlists?: UserPlaylistType[];
  shows?: PodcastType[];
  episodes?: PodcastEpisodeType[];
  audiobooks?: AudiobookType[];
  topTracks?: TopTrackType[];
}

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
  StateStore,
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
      const searchOffset = get().searchOffset;
      const searchLimit = get().searchLimit;
      const searchFilters = get().searchFilters;

      const result = await fetchFromSpotify<any, SearchResultType>({
        endpoint: `search?q=${query}&type=${searchFilters}&offset=${searchOffset}&limit=${searchLimit}`,
        cacheName: `search_${query}`,
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
        transformFn: async (data) => {
          console.log("🔍 Search API Response:", data);

          const transformedData: SearchResultType = {
            tracks:
              data.tracks?.items?.map((track: any) => {
                console.log("🎵 Track data:", track);
                return {
                  name: track?.name ?? "Unknown Track",
                  id: track.id, // Spotify always provides IDs
                  imageUrl: track?.album?.images?.[0]?.url ?? "",
                  multipleArtists:
                    Array.isArray(track?.artists) && track?.artists?.length > 1,
                  artists: Array.isArray(track?.artists)
                    ? track.artists.map((artist: any) => ({
                        name: artist?.name ?? "Unknown Artist",
                        artistId: artist.id, // Spotify always provides IDs
                      }))
                    : [],
                  type: track?.type ?? "track",
                  trackDuration: track?.duration_ms ?? 0,
                  releaseDate: track?.album?.release_date ?? "",
                  albumName: track?.album?.name ?? "Unknown Album",
                  albumId: track?.album?.id, // Spotify always provides IDs
                };
              }) ?? [],
            artists:
              data.artists?.items?.map((artist: any) => {
                console.log("👨‍🎤 Artist data:", artist);
                return {
                  name: artist?.name ?? "Unknown Artist",
                  id: artist.id, // Spotify always provides IDs
                  imageUrl: artist?.images?.[0]?.url ?? "",
                  type: artist?.type ?? "artist",
                };
              }) ?? [],
            albums:
              data.albums?.items?.map((album: any) => {
                console.log("💿 Album data:", album);
                return {
                  name: album?.name ?? "Unknown Album",
                  id: album.id, // Spotify always provides IDs
                  imageUrl: album?.images?.[0]?.url,
                  artists:
                    album?.artists?.map((artist: any) => ({
                      name: artist?.name ?? "Unknown Artist",
                      id: artist.id, // Spotify always provides IDs
                    })) ?? [],
                  releaseDate: album?.release_date ?? "",
                  totalTracks: album?.total_tracks ?? 0,
                };
              }) ?? [],
            playlists:
              data.playlists?.items?.map((playlist: any) => {
                console.log("📋 Playlist data:", playlist);
                return {
                  name: playlist?.name ?? "Unknown Playlist",
                  id: playlist.id, // Spotify always provides IDs
                  imageUrl: playlist?.images?.[0]?.url ?? "",
                  ownerName: playlist?.owner?.display_name ?? "Unknown Owner",
                  ownerId: playlist?.owner?.id, // Spotify always provides IDs
                  type: playlist?.type ?? "playlist",
                };
              }) ?? [],
            shows:
              data.shows?.items?.map((show: any) => {
                console.log("🎙️ Show data:", show);
                return {
                  name: show?.name ?? "Unknown Show",
                  id: show.id, // Spotify always provides IDs
                  imageUrl: show?.images?.[0]?.url ?? "",
                  publisher: show?.publisher ?? "Unknown Publisher",
                  type: show?.type ?? "show",
                };
              }) ?? [],
            episodes:
              data.episodes?.items?.map((episode: any) => {
                console.log("🎧 Episode data:", episode);
                return {
                  name: episode?.name ?? "Unknown Episode",
                  id: episode.id, // Spotify always provides IDs
                  imageUrl: episode?.images?.[0]?.url ?? "",
                  durationMs: episode?.duration_ms ?? 0,
                  releaseDate: episode?.release_date ?? "",
                  type: episode?.type ?? "episode",
                };
              }) ?? [],
            audiobooks:
              data.audiobooks?.items?.map((audiobook: any) => {
                console.log("📚 Audiobook data:", audiobook);
                return {
                  name: audiobook?.name ?? "Unknown Audiobook",
                  id: audiobook.id, // Spotify always provides IDs
                  imageUrl: audiobook?.images?.[0]?.url ?? "",
                  authors:
                    audiobook?.authors?.map((author: any) => ({
                      name: author?.name ?? "Unknown Author",
                      id: author.id, // Spotify always provides IDs
                    })) ?? [],
                  type: audiobook?.type ?? "audiobook",
                };
              }) ?? [],
          };

          // If we have an artist in the results, get their top tracks
          if (data.artists?.items && data.artists.items.length > 0) {
            const getTopTracks = get().getTopTracks;
            const topTracks = await getTopTracks(data.artists.items[0].id);
            if (topTracks) {
              transformedData.topTracks = topTracks;
            }
          }

          return transformedData;
        },
      });

      if (!result) throw new Error("Couldn't fetch search results");

      let topTracks;
      if (result.artists && result.artists.length > 0) {
        // call top tracks for 1st artist
        topTracks = await get().getTopTracks(result.artists[0].id);
        if (topTracks) {
          result.topTracks = topTracks;
        }
      }

      if (!result.artists || result.artists.length === 0) {
        return result;
      }

      const topResultToStore: TopResultType = {
        imageUrl: result.artists[0].imageUrl,
        name: result.artists[0].name,
        id: result.artists[0].id,
        topTracks: result.topTracks || [],
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
