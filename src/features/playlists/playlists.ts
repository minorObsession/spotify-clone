import { StateCreator } from "zustand";
import { StateStore } from "../../state/store";
import { AccessTokenType } from "../auth/Auth";
import { getFromLocalStorage } from "../auth/authHelpers";
import { TrackType } from "../tracks/track";
import { flexibleMillisecondsConverter } from "../../helpers/helperFunctions";

export interface UserPlaylistType {
  name: string;
  id: string;
  images: any[];
  ownerName: string;
}

export interface DetailedPlaylistType {
  id: string;
  name: string;
  type: string;
  ownerName: string;
  ownerId: string;
  tracks: TrackType[];
  numTracks: number;
  totalDurationMs: number;
  imageUrl: string;
}
export interface PlaylistSlice {
  playlists: UserPlaylistType[];
  playlist: DetailedPlaylistType | object;
  getUserPlaylists: () => Promise<UserPlaylistType[]>;
  getPlaylist: (
    id: string,
    type?: "playlists" | "shows" | "albums",
  ) => Promise<DetailedPlaylistType>;
}

export const createPlaylistSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  PlaylistSlice
> = (set) => ({
  playlists: [],
  playlist: {},
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
        return storedPlaylists;
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

      return formattedPlaylists;
    } catch (err) {
      console.error("🛑 ❌", err);
      return []; // ensures the function always returns UserPlaylistType[]
    }
  },

  getPlaylist: async (id, type = "playlists") => {
    try {
      // ! access token LS check
      const accessToken = getFromLocalStorage<AccessTokenType>("access_token");
      if (!accessToken)
        throw new Error("Access token expired or doesn't exist");

      // ! check LS for playlist
      const storedPlaylist = getFromLocalStorage<DetailedPlaylistType>(
        `playlist_${id}`,
      );

      if (storedPlaylist) {
        set({ playlist: storedPlaylist });
        return storedPlaylist;
      }

      // ! if not in LS, then fetch playlist
      console.log("🛜 getPlaylist will call api...");
      const res = await fetch(`https://api.spotify.com/v1/${type}/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("No playlist or bad request");

      const data = await res.json();
      // console.log(data);

      const totalDurationMs = data.tracks.items.reduce(
        (sum: number, item: any) => sum + (item.track?.duration_ms || 0),
        0,
      );
      const playlist: DetailedPlaylistType = {
        name: data.name,
        id: data.id,
        type: data.type,
        tracks: data.tracks.items.map(
          (track: any): TrackType => ({
            name: track.track.name,
            trackId: track.track.id,
            imageUrl:
              track.track.album.images.length > 0
                ? track.track.album.images[0].url
                : "",
            multipleArtists: track.track.artists.length > 1,
            artists: track.track.artists.map((artist: any) => ({
              name: artist.name,
              artistId: artist.id,
            })),
            type: track.track.type,
            trackDuration: flexibleMillisecondsConverter(
              track.track.duration_ms,
            ),
            releaseDate: track.track.album.release_date,
            albumName: track.track.album.name,
            albumId: track.track.album.id,
          }),
        ),
        numTracks: data.tracks.items.length,
        totalDurationMs,
        imageUrl: data.images.length > 0 ? data.images[0].url : null,
        ownerName: data.owner.display_name,
        ownerId: data.owner.id,
      };

      set({ playlist });

      // ! store this playlist in LS
      localStorage.setItem(`playlist_${id}`, JSON.stringify(playlist));

      return playlist;
    } catch (err) {
      console.error("🛑 ❌", err);
      throw new Error("Failed to fetch playlist/show");
    }
  },
});
