import { AuthSlice, createAuthSlice } from "./Auth.z";
import { createPlaylistSlice, PlaylistSlice } from "./playlists";
import { createTrackSlice } from "./track";

import { createUserSlice, UserSlice } from "./user";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type StateStore = AuthSlice & UserSlice & PlaylistSlice;
// RecommendationsSlice;

export const useStateStore = create<StateStore>()(
  devtools((...args) => ({
    ...createAuthSlice(...args),
    ...createUserSlice(...args),
    ...createPlaylistSlice(...args),
    ...createTrackSlice(...args),
    // ...createRecommendationsSlice(...args),
  })),
);
