import { getAccessToken } from "../auth/authHelpers";
import { StateCreator } from "zustand";
import { useStateStore, StateStore } from "./store";

export interface UserPlaylist {
  name: string;
  id: string;
  images: any[];
  ownerName: string;
}

// export interface DetailedPlaylist {}

export interface PlaylistSlice {
  playlists: UserPlaylist[];
  getUserPlaylists: () => Promise<void>;
  getPlaylistOrShow: (id: string) => Promise<null>;
}

export const createPlaylistSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  PlaylistSlice
> = (set) => ({
  playlists: [],
  getUserPlaylists: async () => {
    console.log("running getUserPlaylists");
    try {
      const accessToken = getAccessToken();
      // const userID = useStateStore.getState().userID;

      if (!accessToken)
        throw new Error("Access token expired or doesn't exist");
      // if (!userID) throw new Error("User ID is missing");

      const res = await fetch(`https://api.spotify.com/v1/me/playlists`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken?.token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("No playlists or bad request");

      const { items } = await res.json();
      // Extract only the relevant playlist info
      const formattedPlaylists: UserPlaylist[] = items.map((playlist: any) => ({
        name: playlist.name,
        id: playlist.id,
        images: playlist.images || [],
        ownerName: playlist.owner?.display_name || "",
      }));
      set({ playlists: formattedPlaylists });
    } catch (err) {
      console.error("🛑 ❌", err);
    }
  },
  getPlaylistOrShow: async (id) => {
    try {
      const accessToken = getAccessToken();
      // const userID = useStateStore.getState().userID;

      if (!accessToken)
        throw new Error("Access token expired or doesn't exist");

      const res = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("No playlists or bad request");

      const data = await res.json();
      console.log(data);

      // Extract only the relevant playlist info
      // const formattedPlaylists: UserPlaylist[] = items.map((playlist: any) => ({
      //   name: playlist.name,
      //   id: playlist.id,
      //   images: playlist.images || [],
      //   ownerName: playlist.owner?.display_name || "",
      // }));
      // set({ playlists: formattedPlaylists });
      return data;
    } catch (err) {
      console.error("🛑 ❌", err);
    }
  },
});
