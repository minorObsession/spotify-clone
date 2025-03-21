import { getFromLocalStorage } from "../auth/authHelpers";
import { StateCreator } from "zustand";
import { StateStore } from "./store";
import { AccessTokenType } from "./Auth.z";

export interface UserPlaylistType {
  name: string;
  id: string;
  images: any[];
  ownerName: string;
}

// data.tracks.items (length)
// ! items.forEach (item) ->
// 1) item.track.duration_ms... add up total duration;
// 2) item.track.name.artists ->  (arr).forEach (artist)-> artist.name (to display name)
// data.images[0]
// data.owner.display_name
// data.owner.id - to look for avatar image
export interface DetailedPlaylist {
  name: string;
  id: string;
  playlistImages: any[]; // maybe get only 1 img
  ownerName: string;
  ownerID: string; // needed to get owner avatar image
  tracks: any[];
  totalPlaybackDuration: number; // add up tracks duration + format
  artists: string[];
}

export interface PlaylistSlice {
  playlists: UserPlaylistType[];
  playlist: any[];
  getUserPlaylists: () => Promise<void>;
  getPlaylistOrShow: (
    id: string,
    type?: "playlists" | "shows" | "album",
  ) => Promise<null>;
}

export const createPlaylistSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  PlaylistSlice
> = (set) => ({
  playlists: [],
  playlist: [],
  getUserPlaylists: async () => {
    try {
      // ! access token
      const accessToken = getFromLocalStorage<AccessTokenType>("access_token");
      if (!accessToken) {
        // * maybe call requestToken here...
        throw new Error("Access token expired or doesn't exist");
      }

      // ! check local storage for playlists
      const storedPlaylists =
        getFromLocalStorage<UserPlaylistType[]>("user_playlists");

      if (storedPlaylists) {
        set({ playlists: storedPlaylists });
        return;
      }

      // ! if not in LS, then fetch
      console.log("🛜 getUserPlaylists will call api...");
      const res = await fetch(`https://api.spotify.com/v1/me/playlists`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken?.token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("No playlists or bad request");

      const { items } = await res.json();

      const formattedPlaylists: UserPlaylistType[] = items.map(
        (playlist: any) => ({
          name: playlist.name,
          id: playlist.id,
          images: playlist.images || [],
          ownerName: playlist.owner?.display_name || "",
        }),
      );

      // ! store playlists in LS
      localStorage.setItem("user_playlists", JSON.stringify(items));

      set({ playlists: formattedPlaylists });
    } catch (err) {
      console.error("🛑 ❌", err);
    }
  },

  getPlaylistOrShow: async (id, type = "playlists") => {
    try {
      // ! access token LS check
      const accessToken = getFromLocalStorage<AccessTokenType>("access_token");
      if (!accessToken) {
        // * maybe call requestToken here...
        throw new Error("Access token expired or doesn't exist");
      }

      // ! check LS for playlist
      const storedPlaylist = getFromLocalStorage<any[]>(`playlist_${id}`);

      if (storedPlaylist) {
        set({ playlist: storedPlaylist });
        return;
      }

      // ! if not in LS, then fetch playlist
      console.log("🛜 getPlaylistOrShow will call api...");
      const res = await fetch(`https://api.spotify.com/v1/${type}/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("No playlist or bad request");

      const data = await res.json();

      // ! store this playlist in LS
      localStorage.setItem(`playlist_${id}`, JSON.stringify(data));

      return data;
    } catch (err) {
      console.error("🛑 ❌", err);
    }
  },
});
