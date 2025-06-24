import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { AuthSlice, createAuthSlice } from "../features/auth/Auth";
import { createUserSlice, UserSlice } from "../features/user/user";
import {
  createPlaylistSlice,
  PlaylistSlice,
} from "../features/playlists/playlists";
import { createTrackSlice, TrackSlice } from "../features/tracks/track";
import { ArtistSlice, createArtistSlice } from "../features/artists/artist";
import {
  createPlaybackSlice,
  PlaybackSlice,
} from "../features/playback/playback";
import {
  createSpotifyPlayerSlice,
  SpotifyPlayerSlice,
} from "../features/playback/spotifyPlayerSlice";
import { SearchSlice, createSearchSlice } from "../features/search/search";
import { AlbumSlice, createAlbumSlice } from "../features/albums/album";
import { createPodcastSlice, PodcastSlice } from "../features/podcasts/podcast";

// Custom cache storage that uses the same cache as service worker
const cacheStorage = {
  getItem: async (name: string) => {
    try {
      const cache = await caches.open("spotify-cache-v1");
      const response = await cache.match(`zustand-${name}`);
      if (response) {
        return await response.text();
      }
      return null;
    } catch (error) {
      console.error("Failed to get from cache storage:", error);
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    try {
      const cache = await caches.open("spotify-cache-v1");
      await cache.put(
        `zustand-${name}`,
        new Response(value, {
          headers: {
            "Content-Type": "application/json",
            "sw-cache-time": new Date().toISOString(),
          },
        }),
      );
    } catch (error) {
      console.error("Failed to set cache storage:", error);
    }
  },
  removeItem: async (name: string) => {
    try {
      const cache = await caches.open("spotify-cache-v1");
      await cache.delete(`zustand-${name}`);
    } catch (error) {
      console.error("Failed to remove from cache storage:", error);
    }
  },
};

export type StateStore = AuthSlice &
  UserSlice &
  PlaylistSlice &
  TrackSlice &
  ArtistSlice &
  AlbumSlice &
  PlaybackSlice &
  SpotifyPlayerSlice &
  SearchSlice &
  PodcastSlice;

export const useStateStore = create<StateStore>()(
  devtools(
    persist(
      (...args) => ({
        ...createAuthSlice(...args),
        ...createUserSlice(...args),
        ...createPlaylistSlice(...args),
        ...createTrackSlice(...args),
        ...createArtistSlice(...args),
        ...createAlbumSlice(...args),
        ...createPlaybackSlice(...args),
        ...createSpotifyPlayerSlice(...args),
        ...createSearchSlice(...args),
        ...createPodcastSlice(...args),
      }),
      {
        name: "spotify-clone-state-storage",
        storage: createJSONStorage(() => cacheStorage),
        partialize: (state: StateStore) => ({
          // Auth state (tokens should persist)

          // User data
          user: state.user,
          usersSavedTracks: state.usersSavedTracks,

          // Playlists
          playlists: state.playlists,
          playlistNamesWithIds: state.playlistNamesWithIds,

          // Podcasts (liked episodes)
          likedEpisodes: state.likedEpisodes,

          // Playback settings
          currVolume: state.currVolume,

          // Search preferences
          searchFilter: state.searchFilter,
        }),
      },
    ),
    {
      name: "Spotify Clone State Storage",
    },
  ),
);

export const store = useStateStore;

// // albums
// artist slice
// albums slice
// playlists slice
// tracks slice
// search
// user
// podcasts
// spotify player
// shows slice
