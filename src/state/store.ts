import { create } from "zustand";
import { devtools } from "zustand/middleware";
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

export type StateStore = AuthSlice &
  UserSlice &
  PlaylistSlice &
  TrackSlice &
  ArtistSlice &
  PlaybackSlice &
  SpotifyPlayerSlice &
  SearchSlice;

// RecommendationsSlice;

export const useStateStore = create<StateStore>()(
  devtools((...args) => ({
    ...createAuthSlice(...args),
    ...createUserSlice(...args),
    ...createPlaylistSlice(...args),
    ...createTrackSlice(...args),
    ...createArtistSlice(...args),
    ...createPlaybackSlice(...args),
    ...createSpotifyPlayerSlice(...args),
    ...createSearchSlice(...args),
  })),
);

export const store = useStateStore;
