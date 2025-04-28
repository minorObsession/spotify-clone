import { StateCreator } from "zustand";
import { StateStore } from "../../state/store";
import { AccessTokenType } from "../auth/Auth";
import { getFromLocalStorage } from "../auth/authHelpers";
import { TrackType } from "../tracks/track";
import { fetchFromSpotify } from "../../state/helpers";

export interface UserPlaylistType {
  name: string;
  id: string;
  // * extract only 1 image!
  image: string;
  ownerName: string;
  // uri: string;
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

interface PlaylistNamesWithidsType {
  name: string;
  ids: string[];
}
export interface PlaylistSlice {
  playlists: UserPlaylistType[];
  playlistNamesWithids: PlaylistNamesWithidsType[];
  playlist: DetailedPlaylistType | object;
  getUserPlaylists: () => Promise<UserPlaylistType[] | null>;
  getPlaylist: (
    id: string,
    offset?: number,
    type?: "playlists" | "shows" | "albums",
  ) => Promise<DetailedPlaylistType>;
}

export const createPlaylistSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  PlaylistSlice
> = (set, get) => ({
  playlists: JSON.parse(localStorage.getItem("user_playlists")!) || [],
  playlistNamesWithids:
    JSON.parse(localStorage.getItem("playlist_names_with_track_ids")!) || [],
  playlist: {},
  // ! STILL LEFT TO REFACTOR getUserPlaylists
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

      const storedPlaylistsWithids = getFromLocalStorage<
        PlaylistNamesWithidsType[]
      >("playlist_names_with_track_ids");

      const likedSongs =
        getFromLocalStorage<DetailedPlaylistType>("users_saved_tracks");

      if (storedPlaylists) {
        set({ playlists: storedPlaylists });

        if (storedPlaylistsWithids) {
          set({ playlistNamesWithids: storedPlaylistsWithids });
        }

        if (likedSongs) {
          set({ usersSavedTracks: likedSongs });
        } else {
          set({ usersSavedTracks: await get().getUserSavedTracks(0) });
        }

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
      console.log(items);

      const playlistNamesWithids: PlaylistNamesWithidsType[] =
        await Promise.all(
          items.map(async (playlist: any) => {
            const idsForCurrentP = (
              await get().getPlaylist(playlist.id)
            ).tracks.map((track: TrackType) => track.id);

            return {
              name: playlist.name,
              ids: idsForCurrentP,
            };
          }),
        );

      console.log(playlistNamesWithids);
      set({ playlistNamesWithids });

      const formattedPlaylists: UserPlaylistType[] = items.map(
        (playlist: any) => ({
          name: playlist.name,
          id: playlist.id,
          image: playlist.images?.[0]?.url,
          ownerName: playlist.owner?.display_name || "",
          // uri: playlist.uri,
        }),
      );

      // ! store playlists and ids in LS
      localStorage.setItem(
        "user_playlists",
        JSON.stringify(formattedPlaylists),
      );
      localStorage.setItem(
        "playlist_names_with_track_ids",
        JSON.stringify(playlistNamesWithids),
      );

      set({ playlists: formattedPlaylists });

      await get().getUserSavedTracks(0);

      return formattedPlaylists;
    } catch (err) {
      console.error("🛑 ❌", err);
      return []; // ensures the function always returns UserPlaylistType[]
    }
  },
  getPlaylist: async (id, offset = 0) => {
    if (id === "liked_songs") {
      console.log(
        "getP called... will set trascks to ",
        get().usersSavedTracks,
      );
      return get().usersSavedTracks as DetailedPlaylistType;
    }

    const result = await fetchFromSpotify<any, DetailedPlaylistType>({
      endpoint: `playlists/${id}`,
      cacheName: `playlist${id}`,
      offset: `?offset=${offset}&limit=50`,
      transformFn: (data) => ({
        // uri: data.uri,
        name: data.name,
        id: data.id,
        type: data.type,
        tracks: data.tracks.items.map(
          (track: any): TrackType => ({
            // uri: track.track.uri,
            name: track.track.name,
            id: track.track.id,
            imageUrl:
              track.track.album.images.length > 0
                ? track.track.album.images[0].url
                : null,
            multipleArtists: track.track.artists.length > 1,
            artists: track.track.artists.map((artist: any) => ({
              name: artist.name,
              artistId: artist.id,
            })),
            type: track.track.type,
            trackDuration: track.track.duration_ms,

            releaseDate: track.track.album.release_date,
            albumName: track.track.album.name,
            albumId: track.track.album.id,
          }),
        ),
        numTracks: data.tracks.items.length,
        totalDurationMs: data.tracks.items.reduce(
          (sum: number, item: any) => sum + (item.track?.duration_ms || 0),
          0,
        ),
        imageUrl: data.images?.[0]?.url || "",
        ownerName: data.owner.display_name,
        ownerId: data.owner.id,
      }),
      onCacheFound: (data) => set({ playlist: data }),
      onDataReceived: (data) => set({ playlist: data }),
    });

    // ! WHERE WILL THE ERROR BE CAUGHT????
    if (!result) throw new Error("Couldn't not fetch playlist");
    return result;
  },
});
