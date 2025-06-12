import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
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
          searchFilters: state.searchFilters,
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
