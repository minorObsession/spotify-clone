import { StateCreator } from "zustand";
import { StateStore } from "../../state/store";
import { TrackType } from "../tracks/track";
import { fetchFromSpotify } from "../../state/helpers";
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
  selectedPlaylistId: string | null;
  setSelectedPlaylistId: (id: string | null) => void;
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
  // ! CONSIDER REMOVING THIS STATE COMPLETELY

  selectedPlaylistId: null,
  setSelectedPlaylistId: (id) => {
    set(
      { selectedPlaylistId: id },
      undefined,
      "playlist/setSelectedPlaylistId",
    );
  },
  setPlaylist: (playlist) => {
    set({ playlist }, undefined, "playlist/setPlaylist");
    // Cache is now handled by persist middleware
  },

  getUserPlaylists: async () => {
    const accessToken: AccessTokenType = JSON.parse(
      Cookies.get("accessToken") || "{}",
    );

    if (!accessToken?.token)
      throw new Error("Access token expired or doesn't exist");

    // Check persisted state first (handled automatically by persist middleware)
    const playlists = get().playlists;
    const playlistNamesWithIds = get().playlistNamesWithIds;
    const usersSavedTracks = get().usersSavedTracks;
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
        endpoint: `me/playlists?limit=10`,
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
    return await wrapPromiseResult(
      fetchFromSpotify<
        SpotifyApi.PlaylistObjectSimplified,
        DetailedPlaylistType
      >({
        endpoint: `playlists/${id}/images`,
        method: "PUT",
        requestBody: base64ImageUrl,
      }).then(() => true),
    );
  },

  updatePlaylistDetails: async (id, updatedFields) => {
    return await wrapPromiseResult<void>(
      fetchFromSpotify<SpotifyApi.PlaylistObjectSimplified, void>({
        endpoint: `playlists/${id}`,
        method: "PUT",
        requestBody: JSON.stringify({
          name: updatedFields.name,
          description: updatedFields.description || "",
        }),
      }),
    );
  },

  addTrackToPlaylist: async (id, trackId) => {
    return await wrapPromiseResult<void>(
      fetchFromSpotify<SpotifyApi.AddTracksToPlaylistResponse, void>({
        endpoint: `playlists/${id}/tracks`,
        method: "POST",
        requestBody: JSON.stringify({
          uris: [`spotify:track:${trackId}`],
        }),
      }),
    );
  },

  addToLikedSongs: async (trackId: string) => {
    return await wrapPromiseResult<void>(
      fetchFromSpotify<SpotifyApi.AddTracksToPlaylistResponse, void>({
        endpoint: `me/tracks`,
        method: "PUT",
        requestBody: JSON.stringify({
          ids: [trackId],
        }),
      }),
    );
  },
});
