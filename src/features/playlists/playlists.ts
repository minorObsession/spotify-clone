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
export interface playlistNamesWithIdsType {
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
  playlistNamesWithIds: playlistNamesWithIdsType[];
  // playlistsFetched: boolean;
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
  [["zustand/devtools", never], ["zustand/persist", unknown]],
  [],
  PlaylistSlice
> = (set, get) => ({
  playlists: [],
  playlist: initialEmptyPlaylist,
  playlistNamesWithIds: [],
  // playlistsFetched: false,
  setPlaylist: (playlist) => {
    set({ playlist }, undefined, "playlist/setPlaylist");
    // Cache is now handled by persist middleware
  },

  getUserPlaylists: async () => {
    try {
      // const playlistsFetched = get().playlistsFetched;
      // if (playlistsFetched) {
      //   const playlists = get().playlists;
      //   return playlists;
      // }

      // set(
      //   { playlistsFetched: true },
      //   undefined,
      //   "playlist/setPlaylistsFetched",
      // );

      const accessToken = getFromLocalStorage<AccessTokenType>("access_token");
      if (!accessToken)
        throw new Error("Access token expired or doesn't exist");

      // Check persisted state first (handled automatically by persist middleware)
      const playlists = get().playlists;
      const playlistNamesWithIds = get().playlistNamesWithIds;
      const usersSavedTracks = get().usersSavedTracks;
      console.log(usersSavedTracks);
      if (playlists.length > 0) {
        set({ playlists }, undefined, "playlist/setPlaylistsFromCache");

        if (playlistNamesWithIds.length > 0) {
          set(
            { playlistNamesWithIds },
            undefined,
            "playlist/setPlaylistNamesWithIds",
          );
        }

        if (!usersSavedTracks) {
          console.log("getting usersSavedTracks from API");
          set(
            { usersSavedTracks: await get().getUserSavedTracks(0) },
            undefined,
            "playlist/setUserSavedTracksFromAPI",
          );
        }

        return playlists;
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

      const newPlaylistNamesWithIds: playlistNamesWithIdsType[] =
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

      set(
        { playlistNamesWithIds: newPlaylistNamesWithIds },
        undefined,
        "playlist/setPlaylistNamesWithIds",
      );

      const formattedPlaylists: UserPlaylistType[] = items.map(
        (playlist: any) => ({
          name: playlist.name,
          id: playlist.id,
          image: playlist.images?.[0]?.url,
          ownerName: playlist.owner?.display_name || "",
        }),
      );

      // Data is now persisted automatically by persist middleware
      set(
        { playlists: formattedPlaylists },
        undefined,
        "playlist/setPlaylists",
      );
      await get().getUserSavedTracks(0);

      // set(
      //   { playlistsFetched: true },
      //   undefined,
      //   "playlist/setPlaylistsFetchedComplete",
      // );

      return formattedPlaylists;
    } catch (error) {
      console.error("Error fetching playlists:", error);
      throw error;
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
          bypassCache: true,
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
          onCacheFound: (data) =>
            set({ playlist: data }, undefined, "playlist/setPlaylistFromCache"),
          onDataReceived: (data) =>
            set({ playlist: data }, undefined, "playlist/setPlaylistFromAPI"),
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
