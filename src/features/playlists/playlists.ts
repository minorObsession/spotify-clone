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
  images: any[] | string;
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

interface PlaylistNamesWithTrackIdsType {
  name: string;
  trackIds: string[];
}
export interface PlaylistSlice {
  playlists: UserPlaylistType[];
  playlistNamesWithTrackIds: PlaylistNamesWithTrackIdsType[];
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
  playlistNamesWithTrackIds:
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

      const storedPlaylistsWithTrackIds = getFromLocalStorage<
        PlaylistNamesWithTrackIdsType[]
      >("playlist_names_with_track_ids");

      const likedSongs =
        getFromLocalStorage<DetailedPlaylistType>("users_saved_tracks");

      if (storedPlaylists && storedPlaylistsWithTrackIds) {
        set({ playlists: storedPlaylists });
        set({ playlistNamesWithTrackIds: storedPlaylistsWithTrackIds });
        if (likedSongs) set({ usersSavedTracks: likedSongs });
        else set({ usersSavedTracks: await get().getUserSavedTracks(0) });

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
      // const tracksTempArray: Record<string, string[]>[] = [];

      const playlistNamesWithTrackIds: PlaylistNamesWithTrackIdsType[] =
        await Promise.all(
          items.map(async (playlist: any) => {
            const trackIdsForCurrentP = (
              await get().getPlaylist(playlist.id)
            ).tracks.map((track: TrackType) => track.trackId);

            return {
              name: playlist.name,
              trackIds: trackIdsForCurrentP,
            };
          }),
        );

      set({ playlistNamesWithTrackIds });

      const formattedPlaylists: UserPlaylistType[] = items.map(
        (playlist: any) => ({
          name: playlist.name,
          id: playlist.id,
          images: playlist.images || [],
          ownerName: playlist.owner?.display_name || "",
        }),
      );

      // ! store playlists and trackIds in LS
      localStorage.setItem(
        "user_playlists",
        JSON.stringify(formattedPlaylists),
      );
      localStorage.setItem(
        "playlist_names_with_track_ids",
        JSON.stringify(playlistNamesWithTrackIds),
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
        imageUrl: data.images.length > 0 ? data.images[0].url : null,
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
