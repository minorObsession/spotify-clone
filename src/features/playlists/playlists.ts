import { StateCreator } from "zustand";
import { StateStore } from "../../state/store";
import { TrackType } from "../tracks/track";
import {
  fetchFromSpotify,
  invalidateCacheForEndpoint,
} from "../../state/helpers";
import { PartialPlaylist } from "../../components/EditPlaylistModal";
import { AsyncResult, wrapPromiseResult } from "../../types/reusableTypes";
import { AccessTokenType } from "../auth/Auth";
import Cookies from "js-cookie";

export interface UserPlaylistType {
  name: string;
  id: string;
  imageUrl: string; // Extract only 1 image
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
  setUserPlaylists: (playlists: UserPlaylistType[]) => void;
  setPlaylistNamesWithIds: (
    playlistNamesWithIds: playlistNamesWithIdsType[],
  ) => void;
  setPlaylist: (playlist: DetailedPlaylistType) => void;
  getUserPlaylists: () => Promise<AsyncResult<UserPlaylistType[]>>;
  getPlaylist: (
    id: string,
    offset?: number,
    bypassCache?: boolean,
    type?: "playlists" | "podcasts" | "albums",
  ) => Promise<AsyncResult<DetailedPlaylistType>>;
  uploadNewPlaylistImage: (
    id: string,
    base64ImageUrl: string,
  ) => Promise<AsyncResult<boolean>>;
  updatePlaylistDetails: (
    id: string,
    updatedPlaylist: PartialPlaylist,
  ) => Promise<AsyncResult<void>>;
  addTrackToPlaylist: (
    id: string,
    trackId: string,
  ) => Promise<AsyncResult<void>>;
  addToLikedSongs: (trackId: string) => Promise<AsyncResult<void>>;
  removeTrackFromPlaylist: (
    id: string,
    trackId: string,
  ) => Promise<AsyncResult<void>>;
  createNewPlaylist: (
    name: string,
    trackId: string,
    imageUrl: string,
  ) => Promise<AsyncResult<UserPlaylistType>>;
  deletePlaylist: (id: string) => Promise<AsyncResult<void>>;
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
  setUserPlaylists: (playlists) => {
    set(
      (prevState) => ({
        ...prevState,
        playlists,
      }),
      undefined,
      "playlist/setUserPlaylists",
    );
  },
  setPlaylistNamesWithIds: (playlistNamesWithIds) => {
    set(
      (prevState) => ({
        ...prevState,
        playlistNamesWithIds,
      }),
      undefined,
      "playlist/setPlaylistNamesWithIds",
    );
  },
  setPlaylist: (playlist) => {
    set(
      (prevState) => ({
        ...prevState,
        playlist,
      }),
      undefined,
      "playlist/setPlaylist",
    );
  },

  getUserPlaylists: async () => {
    const accessToken: AccessTokenType = JSON.parse(
      Cookies.get("accessToken") || "{}",
    );

    if (!accessToken?.token)
      throw new Error("Access token expired or doesn't exist");

    // Check persisted state first (handled automatically by persist middleware)
    const { playlists, playlistNamesWithIds, usersSavedTracks } = get();
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
        const result = await get().getUserSavedTracks(0);
        if (!result.success) return result;
        set(
          { usersSavedTracks: result.data },
          undefined,
          "playlist/setUserSavedTracksFromAPI",
        );
      }

      return { success: true, data: playlists };
    }

    console.log("🛜 getUserPlaylists will call api...");

    // Use fetchFromSpotify instead of direct fetch - this will use service worker cache
    return await wrapPromiseResult<UserPlaylistType[]>(
      fetchFromSpotify<
        SpotifyApi.ListOfUsersPlaylistsResponse,
        UserPlaylistType[]
      >({
        endpoint: `me/playlists?limit=50`,
        onDataReceived: (data) =>
          set({ playlists: data }, undefined, "playlist/setPlaylistsFromAPI"),
        transformFn: async (data: SpotifyApi.ListOfUsersPlaylistsResponse) => {
          console.log(data);
          const items = data.items || [];

          const newPlaylistNamesWithIds: playlistNamesWithIdsType[] =
            await Promise.all(
              items.map(
                async (playlist: SpotifyApi.PlaylistObjectSimplified) => {
                  const idsForCurrentP = await get().getPlaylist(playlist.id);

                  if (!idsForCurrentP.success)
                    throw new Error("No playlist found");

                  return {
                    name: playlist.name,
                    ids: idsForCurrentP.data?.tracks.map(
                      (track: TrackType) => track.id,
                    ),
                  };
                },
              ),
            );

          set(
            { playlistNamesWithIds: newPlaylistNamesWithIds },
            undefined,
            "playlist/setPlaylistNamesWithIds",
          );

          const formattedPlaylists: UserPlaylistType[] = items.map(
            (playlist: SpotifyApi.PlaylistObjectSimplified) => ({
              name: playlist.name,
              id: playlist.id,
              imageUrl: playlist.images?.[0]?.url,
              ownerName: playlist.owner?.display_name || "",
              trackIds: [], // Will be populated by getPlaylist calls
            }),
          );

          // Get user saved tracks if not already cached
          if (!usersSavedTracks) {
            await get().getUserSavedTracks();
          }

          return formattedPlaylists;
        },
      }),
    );
  },

  getPlaylist: async (id, offset = 0, bypassCache = false) => {
    if (id === "liked_songs") {
      const usersSavedTracks = get().usersSavedTracks;
      if (!usersSavedTracks) {
        const result = await get().getUserSavedTracks();
        if (!result.success) return result;
        set(
          { usersSavedTracks: result.data },
          undefined,
          "playlist/setUserSavedTracksFromAPI",
        );
        return result;
      }
      return { success: true, data: usersSavedTracks };
    }

    return await wrapPromiseResult<DetailedPlaylistType>(
      fetchFromSpotify<SpotifyApi.PlaylistObjectFull, DetailedPlaylistType>({
        endpoint: `playlists/${id}`,
        offset: `?offset=${offset}&limit=5`,
        bypassCache,
        transformFn: (data) => ({
          name: data.name,
          id: data.id,
          type: data.type,
          tracks: data.tracks.items
            .filter((tra: SpotifyApi.PlaylistTrackObject) => tra.track !== null)
            .map(
              (track: SpotifyApi.PlaylistTrackObject): TrackType => ({
                name: track.track?.name ?? "",
                id: track.track?.id ?? "",
                imageUrl: track.track?.album.images[0]?.url ?? "",
                multipleArtists:
                  track.track?.artists?.length &&
                  track.track?.artists?.length > 1
                    ? true
                    : false,
                artists:
                  track.track?.artists?.map(
                    (artist: SpotifyApi.ArtistObjectSimplified) => ({
                      name: artist.name ?? "",
                      artistId: artist.id ?? "",
                    }),
                  ) ?? [],
                type: track.track?.type ?? "",
                trackDuration: track.track?.duration_ms ?? 0,
                releaseDate: track.track?.album.release_date ?? "",
                albumName: track.track?.album.name ?? "",
                albumId: track.track?.album.id ?? "",
              }),
            ),
          numTracks: data.tracks.items.length,
          totalDurationMs: data.tracks.items.reduce(
            (sum: number, item: SpotifyApi.PlaylistTrackObject) =>
              sum + (item.track?.duration_ms ?? 0),
            0,
          ),
          imageUrl: data.images?.[0]?.url ?? "",
          ownerName: data.owner.display_name ?? "",
          ownerId: data.owner.id ?? "",
        }),
        onDataReceived: (data) =>
          set({ playlist: data }, undefined, "playlist/setPlaylistFromAPI"),
      }),
    );
  },

  uploadNewPlaylistImage: async (id, base64ImageUrl) => {
    const result = await wrapPromiseResult(
      fetchFromSpotify<
        SpotifyApi.PlaylistObjectSimplified,
        DetailedPlaylistType
      >({
        endpoint: `playlists/${id}/images`,
        method: "PUT",
        requestBody: base64ImageUrl,
      }).then(() => true),
    );

    if (result.success) await invalidateCacheForEndpoint(`playlists/${id}`);
    return result;
  },

  updatePlaylistDetails: async (id, updatedFields) => {
    const result = await wrapPromiseResult<void>(
      fetchFromSpotify<SpotifyApi.PlaylistObjectSimplified, void>({
        endpoint: `playlists/${id}`,
        method: "PUT",
        requestBody: JSON.stringify({
          name: updatedFields.name,
          description: updatedFields.description,
        }),
      }),
    );

    if (result.success) await invalidateCacheForEndpoint(`playlists/${id}`);
    return result;
  },

  addTrackToPlaylist: async (id, trackId) => {
    const result = await wrapPromiseResult<void>(
      fetchFromSpotify<SpotifyApi.AddTracksToPlaylistResponse, void>({
        endpoint: `playlists/${id}/tracks`,
        method: "POST",
        requestBody: JSON.stringify({
          uris: [`spotify:track:${trackId}`],
        }),
      }),
    );

    if (result.success) {
      await invalidateCacheForEndpoint(`playlists/${id}`);

      // Update UI state internally
      const { playlists, playlistNamesWithIds } = get();

      // Find the playlist by ID
      const playlist = playlists.find((p) => p.id === id);
      if (playlist) {
        // Update user playlists
        const updatedUserPlaylists = playlists.map((p) =>
          p.id === id ? { ...p, trackIds: [...p.trackIds, trackId] } : p,
        );

        // Update playlistNamesWithIds
        const updatedPlaylistNamesWithIds = playlistNamesWithIds.map((p) =>
          p.name === playlist.name ? { ...p, ids: [...p.ids, trackId] } : p,
        );

        set(
          {
            playlists: updatedUserPlaylists,
            playlistNamesWithIds: updatedPlaylistNamesWithIds,
          },
          undefined,
          "playlist/addTrackToPlaylist",
        );
      }
    }

    return result;
  },

  removeTrackFromPlaylist: async (id, trackId) => {
    const result = await wrapPromiseResult<void>(
      fetchFromSpotify<SpotifyApi.RemoveTracksFromPlaylistResponse, void>({
        endpoint: `playlists/${id}/tracks`,
        method: "DELETE",
        requestBody: JSON.stringify({
          tracks: [{ uri: `spotify:track:${trackId}` }],
        }),
      }),
    );

    if (result.success) {
      await invalidateCacheForEndpoint(`playlists/${id}`);

      // Update UI state internally
      const { playlists, playlistNamesWithIds } = get();

      // Find the playlist by ID
      const playlist = playlists.find((p) => p.id === id);
      if (playlist) {
        // Update user playlists
        const updatedUserPlaylists = playlists.map((p) =>
          p.id === id
            ? {
                ...p,
                trackIds: p.trackIds.filter((id) => id !== trackId),
              }
            : p,
        );

        // Update playlistNamesWithIds
        const updatedPlaylistNamesWithIds = playlistNamesWithIds.map((p) =>
          p.name === playlist.name
            ? { ...p, ids: p.ids.filter((id) => id !== trackId) }
            : p,
        );

        set(
          {
            playlists: updatedUserPlaylists,
            playlistNamesWithIds: updatedPlaylistNamesWithIds,
          },
          undefined,
          "playlist/removeTrackFromPlaylist",
        );
      }
    }

    return result;
  },

  addToLikedSongs: async (trackId: string) => {
    const result = await wrapPromiseResult<void>(
      fetchFromSpotify<SpotifyApi.AddTracksToPlaylistResponse, void>({
        endpoint: `me/tracks`,
        method: "PUT",
        requestBody: JSON.stringify({
          ids: [trackId],
        }),
      }),
    );

    if (result.success) await invalidateCacheForEndpoint(`me/tracks`);
    return result;
  },

  createNewPlaylist: async (
    name: string,
    trackId: string,
    imageUrl: string,
  ) => {
    try {
      const userID = get().user?.userID;

      if (!userID)
        return {
          success: false,
          error: new Error("User ID not found"),
        };

      // Create the playlist first
      const result = await wrapPromiseResult<UserPlaylistType>(
        fetchFromSpotify<SpotifyApi.CreatePlaylistResponse, UserPlaylistType>({
          endpoint: `users/${userID}/playlists`,
          method: "POST",
          requestBody: JSON.stringify({
            name,
          }),
          transformFn: (data) => ({
            name: data.name,
            id: data.id,
            imageUrl: imageUrl || data.images?.[0]?.url || "",
            ownerName: data.owner.display_name || get().user?.username || "",
            trackIds: [trackId],
          }),
        }),
      );

      if (!result.success)
        return {
          success: false,
          error: new Error("Failed to create playlist"),
        };

      // Add the track to the newly created playlist
      const addTrackResult = await get().addTrackToPlaylist(
        result.data.id,
        trackId,
      );

      if (!addTrackResult.success) {
        console.error(
          "Failed to add track to new playlist:",
          addTrackResult.error,
        );
        // Still return success for playlist creation, but log the error
      }
      const { playlists, playlistNamesWithIds } = get();

      // Add the new playlist to the state
      set(
        {
          playlists: [result.data, ...playlists],
          playlistNamesWithIds: [
            ...playlistNamesWithIds,
            {
              name: name,
              ids: [trackId],
            },
          ],
        },
        undefined,
        "playlist/addNewPlaylist",
      );

      console.log("✅ Playlist created successfully:", result.data);
      return result;
    } catch (error) {
      console.error("Error creating playlist:", error);
      return {
        success: false,
        error: new Error("Failed to create playlist"),
      };
    }
  },

  deletePlaylist: async (id: string) => {
    try {
      const result = await wrapPromiseResult<void>(
        fetchFromSpotify<void, void>({
          endpoint: `playlists/${id}`,
          method: "DELETE",
        }),
      );

      if (result.success) {
        await invalidateCacheForEndpoint(`playlists/${id}`);
        await invalidateCacheForEndpoint(`me/playlists`);

        // Update UI state internally
        const { playlists, playlistNamesWithIds } = get();

        // Find the playlist by ID to get its name
        const playlist = playlists.find((p) => p.id === id);
        if (playlist) {
          // Remove playlist from state
          const updatedUserPlaylists = playlists.filter((p) => p.id !== id);
          const updatedPlaylistNamesWithIds = playlistNamesWithIds.filter(
            (p) => p.name !== playlist.name,
          );

          set(
            {
              playlists: updatedUserPlaylists,
              playlistNamesWithIds: updatedPlaylistNamesWithIds,
            },
            undefined,
            "playlist/deletePlaylist",
          );
        }
      }
      return result;
    } catch (error) {
      console.error("Error deleting playlist:", error);
      return {
        success: false,
        error: new Error("Failed to delete playlist"),
      };
    }
  },
});
