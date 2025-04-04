import { StateCreator } from "zustand";
import { StateStore } from "../../state/store";
import { fetchFromSpotify } from "../../state/helpers";

export interface UserType {
  username: string;
  photo: string;
  userID: string;
  email: string;
}
export interface UserSlice {
  // ! get partial types
  user: UserType | null;
  usersSavedTracks: any | null;
  getUser: () => Promise<UserType | null>;
  getUserSavedTracks(): Promise<any>;
}

export const createUserSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  UserSlice
> = (set) => ({
  user: null,
  usersSavedTracks: null,
  getUser: async () => {
    return await fetchFromSpotify<any, UserType>({
      endpoint: "me",
      cacheName: "user",
      transformFn: (data) => ({
        username: data.display_name,
        photo: data.images?.[0]?.url || "",
        userID: data.id,
        email: data.email,
      }),
      onCacheFound: (data) => {
        set({ user: data });
      },
      onDataReceived: (data) => {
        set({ user: data });
      },
    });
  },
  // ! TODO: to--do: transform data

  getUserSavedTracks: async () => {
    return await fetchFromSpotify<any, any>({
      endpoint: "me/tracks",
      cacheName: "users_saved_tracks",
      transformFn: (data) => ({
        data,
        // username: data.display_name,
        // photo: data.images?.[0]?.url || "",
        // userID: data.id,
        // email: data.email,
      }),
      onCacheFound: (data) => {
        set({ usersSavedTracks: data });
      },
      onDataReceived: (data) => {
        set({ usersSavedTracks: data });
      },
    });
  },
});
