import { create } from "zustand";
import { useUserStore } from "./user";
import { getAccessToken } from "../auth/authHelpers";
import { devtools } from "zustand/middleware";

export interface Playlist {
  name: string;
  id: string;
  images: any[];
}

export interface PlaylistSlice {
  playlists: Playlist[];
  getPlaylists: () => Promise<void>;
}

export const usePlaylistStore = create<PlaylistSlice>()(
  devtools((set) => ({
    playlists: [],
    getPlaylists: async () => {
      try {
        const accessToken = getAccessToken();
        const userID = useUserStore.getState().userID;

        if (!accessToken)
          throw new Error("Access token expired or doesn't exist");
        if (!userID) throw new Error("User ID is missing");

        const res = await fetch(
          `https://api.spotify.com/v1/users/${userID}/playlists`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken.token}`,
              "Content-Type": "application/json",
            },
          },
        );
        if (!res.ok) throw new Error("No playlists or bad request");

        const { items } = await res.json();
        set({ playlists: items });
      } catch (err) {
        console.error("🛑 ❌", err);
      }
    },
  })),
);
