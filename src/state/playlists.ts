import { getAccessToken } from "../auth/authHelpers";
import { StateCreator } from "zustand";
import { useStateStore, StateStore } from "./store";

export interface Playlist {
  name: string;
  id: string;
  images: any[];
  ownerName: string;
}

export interface PlaylistSlice {
  playlists: Playlist[];
  getPlaylists: () => Promise<void>;
}

export const createPlaylistSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  PlaylistSlice
> = (set) => ({
  playlists: [],
  getPlaylists: async () => {
    try {
      const accessToken = getAccessToken();
      const userID = useStateStore.getState().userID;

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

      // Extract only the relevant playlist info
      const formattedPlaylists: Playlist[] = items.map((playlist: any) => ({
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
});

// // ! OLD
// export const usePlaylistStore = create<PlaylistSlice>()(
//   devtools((set) => ({
//     playlists: [],
//     getPlaylists: async () => {
//       try {
//         const accessToken = getAccessToken();
//         const userID = useUserStore.getState().userID;

//         if (!accessToken)
//           throw new Error("Access token expired or doesn't exist");
//         if (!userID) throw new Error("User ID is missing");

//         const res = await fetch(
//           `https://api.spotify.com/v1/users/${userID}/playlists`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${accessToken.token}`,
//               "Content-Type": "application/json",
//             },
//           },
//         );
//         if (!res.ok) throw new Error("No playlists or bad request");

//         const { items } = await res.json();
//         set({ playlists: items });
//       } catch (err) {
//         console.error("🛑 ❌", err);
//       }
//     },
//   })),
// );
