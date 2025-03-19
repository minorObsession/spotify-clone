import { AuthSlice, createAuthSlice } from "./Auth.z";
import { createPlaylistSlice, PlaylistSlice } from "./playlists";
import { createUserSlice, UserSlice } from "./user";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type StateStore = AuthSlice & UserSlice & PlaylistSlice;

export const useStateStore = create<StateStore>()(
  devtools((...args) => ({
    ...createAuthSlice(...args),
    ...createUserSlice(...args),
    ...createPlaylistSlice(...args),
  })),
);
