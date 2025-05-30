import { StateCreator } from "zustand";
import { StateStore } from "../../state/store";
import { AccessTokenType } from "../auth/Auth";
import { getFromLocalStorage } from "../auth/authHelpers";
import { TrackType } from "../tracks/track";
import { fetchFromSpotify } from "../../state/helpers";
import { PartialPlaylist } from "../../components/EditPlaylistModal";

export interface UserPlaylistType {
  name: string;
  id: string;
  image: string; // Extract only 1 image
  ownerName: string;
  trackIds: string[];
}
export interface DetailedPlaylistType {
  id: string;
  name: string;
  description?: string;
  type: string;
  ownerName: string;
  ownerId: string;
  tracks: TrackType[];
  numTracks: number;
  totalDurationMs: number;
  imageUrl: string;
}
export interface PlaylistNamesWithidsType {
  name: string;
  ids: string[];
}
export const initialEmptyPlaylist: DetailedPlaylistType = {
  id: "",
  name: "",
  type: "",
  ownerName: "",
  ownerId: "",
  tracks: [],
  numTracks: 0,
  totalDurationMs: 0,
  imageUrl: "",
};

export interface PlaylistSlice {
  playlists: UserPlaylistType[];
  playlist: DetailedPlaylistType;
  playlistNamesWithids: PlaylistNamesWithidsType[];
  playlistsFetched: boolean;
  setPlaylist: (playlist: DetailedPlaylistType) => void;
  getUserPlaylists: () => Promise<UserPlaylistType[]>;
  getPlaylist: (
    id: string,
    offset?: number,
    bypassCache?: boolean,
    type?: "playlists" | "shows" | "albums",
  ) => Promise<DetailedPlaylistType>;
  uploadNewPlaylistImage: (
    id: string,
    base64ImageUrl: string,
  ) => Promise<boolean>;
  updatePlaylistDetails: (
    id: string,
    updatedPlaylist: PartialPlaylist,
  ) => Promise<void>;
  addTrackToPlaylist: (id: string, trackId: string) => Promise<void>;
}

export const createPlaylistSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  PlaylistSlice
> = (set, get) => ({
  playlists: [],
  playlist: initialEmptyPlaylist,
  playlistNamesWithids: [],
  playlistsFetched: false,
  setPlaylist: (playlist) => {
    set({ playlist });
    // update cache
    localStorage.setItem(`playlist${playlist.id}`, JSON.stringify(playlist));
  },

  // ! NEVER TRY TO FIT THIS INTO FETCHFROMSPOTIFY!! YOU FAILED 4 TIMES
  getUserPlaylists: async () => {
    try {
      if (get().playlistsFetched) return get().playlists;

      set({ playlistsFetched: true });

      const accessToken = getFromLocalStorage<AccessTokenType>("access_token");
      if (!accessToken)
        throw new Error("Access token expired or doesn't exist");

      const storedPlaylists = getFromLocalStorage<UserPlaylistType[]>(
        `${get().user?.username}_playlists`,
      );
      const storedPlaylistsWithids = getFromLocalStorage<
        PlaylistNamesWithidsType[]
      >(`${get().user?.username}_playlist_names_with_track_ids`);
      const likedSongs = getFromLocalStorage<DetailedPlaylistType>(
        `${get().user?.username}s_saved_tracks`,
      );

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

      console.log("🛜 getUserPlaylists will call api...");

      const res = await fetch(
        `https://api.spotify.com/v1/me/playlists?limit=5`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken?.token}`,
            "Content-Type": "application/json",
          },
        },
      );
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
        }),
      );

      localStorage.setItem(
        `${get().user?.username}_playlists`,
        JSON.stringify(formattedPlaylists),
      );
      localStorage.setItem(
        `${get().user?.username}_playlist_names_with_track_ids`,
        JSON.stringify(playlistNamesWithids),
      );

      set({ playlists: formattedPlaylists });
      await get().getUserSavedTracks(0);

      set({ playlistsFetched: true });

      return formattedPlaylists;
    } catch (err) {
      console.error("🛑 ❌", err);
      return [];
    }
  },

  getPlaylist: async (id, offset = 0, bypassCache = false) => {
    try {
      console.log("getPlaylist running...");

      if (id === "liked_songs") {
        const usersSavedTracks = get().usersSavedTracks;

        if (!usersSavedTracks)
          return (await get().getUserSavedTracks(0)) as DetailedPlaylistType;
        else return usersSavedTracks as DetailedPlaylistType;
      }

      const fetchedPlaylist = await fetchFromSpotify<any, DetailedPlaylistType>(
        {
          endpoint: `playlists/${id}`,
          cacheName: `playlist${id}`,
          offset: `?offset=${offset}&limit=5`,
          bypassCache,
          transformFn: (data) => ({
            name: data.name,
            id: data.id,
            type: data.type,
            tracks: data.tracks.items
              .filter((tra: any) => tra.track !== null)
              .map(
                (track: any): TrackType => ({
                  name: track.track.name,
                  id: track.track.id,
                  imageUrl: track.track.album.images[0]?.url || null,
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
        },
      );

      if (!fetchedPlaylist) throw new Error("Couldn't fetch playlist");
      return fetchedPlaylist;
    } catch (err) {
      console.error("🛑 ❌ Couldn't fetch playlist", err);
      throw err;
    }
  },

  uploadNewPlaylistImage: async (id, base64ImageUrl) => {
    try {
      await fetchFromSpotify({
        endpoint: `playlists/${id}/images`,
        method: "PUT",
        requestBody: base64ImageUrl,
      });

      return true;
    } catch (err) {
      console.error("🛑 ❌ Couldn't upload new image:", err);
      return false;
    }
  },

  // upgrade this method to suppurt tracks updating
  updatePlaylistDetails: async (id, updatedFields) => {
    await fetchFromSpotify({
      endpoint: `playlists/${id}`,
      method: "PUT",
      requestBody: JSON.stringify({
        name: updatedFields.name,
        description: updatedFields.description || "",
      }),
    });
  },

  addTrackToPlaylist: async (id, trackId) => {
    try {
      await fetchFromSpotify({
        endpoint: `playlists/${id}/tracks`,
        method: "POST",
        requestBody: JSON.stringify({ uris: [trackId], position: 0 }),
      });
    } catch (err) {
      console.error(`❌🛑 Could not add track to playlist`, err);
    }
  },

  // addToLikedSongs: async (trackId: string) => {}
});
