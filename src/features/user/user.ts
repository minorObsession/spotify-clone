import { StateCreator } from "zustand";
import { StateStore } from "../../state/store";
import { fetchFromSpotify } from "../../state/helpers";
import { DetailedPlaylistType } from "../playlists/playlists";
import { TrackType } from "../tracks/track";
import { AsyncResult, wrapPromiseResult } from "../../types/reusableTypes";

export interface UserType {
  username: string;
  photo: string;
  userID: string;
  email: string;
}
export interface UserSlice {
  // ! get partial types
  user: UserType | null;
  usersSavedTracks: DetailedPlaylistType | null;
  getUser: () => Promise<AsyncResult<UserType>>;
  getUserSavedTracks(
    offset?: number,
  ): Promise<AsyncResult<DetailedPlaylistType>>;
  logoutUser: () => void;
}

export const createUserSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never], ["zustand/persist", unknown]],
  [],
  UserSlice
> = (set, get) => ({
  user: null,
  usersSavedTracks: null,

  getUser: async () => {
    const user = get().user;
    if (user) return { success: true, data: user };

    return await wrapPromiseResult<UserType>(
      fetchFromSpotify<SpotifyApi.CurrentUsersProfileResponse, UserType>({
        endpoint: "me",
        transformFn: (data) => ({
          username: data.display_name ?? "",
          photo: data.images?.[0]?.url || "",
          userID: data.id,
          email: data.email,
        }),
        onDataReceived: (data) => {
          set({ user: data }, undefined, "user/setUserFromAPI");
        },
      }),
    );
  },

  getUserSavedTracks: async (offset = 0) => {
    const user = get().user;
    const getUser = get().getUser;

    // Ensure we have user data
    if (!user) {
      const userResult = await getUser();
      if (!userResult.success) {
        throw Error("User not found");
      }
    }

    return await wrapPromiseResult<DetailedPlaylistType>(
      fetchFromSpotify<
        SpotifyApi.UsersSavedTracksResponse,
        DetailedPlaylistType
      >({
        endpoint: "me/tracks",
        // ! TEMPORARY LIMIT
        offset: `?offset=${offset}&limit=50`,
        transformFn: (data) => {
          const newTracks = data.items.map(
            (item: SpotifyApi.SavedTrackObject): TrackType => ({
              name: item.track?.name ?? "",
              id: item.track?.id ?? "",
              imageUrl:
                item.track?.album.images.length > 0
                  ? item.track.album.images[0].url
                  : "",
              multipleArtists:
                item.track?.artists?.length && item.track?.artists?.length > 1
                  ? true
                  : false,
              artists:
                item.track?.artists?.map(
                  (artist: SpotifyApi.ArtistObjectSimplified) => ({
                    name: artist.name ?? "",
                    artistId: artist.id ?? "",
                  }),
                ) ?? [],
              type: item.track.type,
              trackDuration: item.track.duration_ms,
              releaseDate: item.track.album.release_date,
              albumName: item.track.album.name,
              albumId: item.track.album.id,
            }),
          );

          const currentSaved = get().usersSavedTracks;
          const mergedTracks: TrackType[] =
            offset > 0 && currentSaved
              ? [...currentSaved.tracks, ...newTracks]
              : newTracks;

          const user = get().user;
          if (!user) throw Error("User not found");

          const tracksToStore = {
            name: "Liked Songs",
            id: "liked_songs",
            type: "playlist",
            ownerName: user.username,
            ownerId: user.userID,
            imageUrl:
              "https://cdn.prod.website-files.com/5e36e6f21212670638c0d63c/5e39d85cee05be53d238681a_likedSongs.png",
            tracks: mergedTracks,
            totalDurationMs: data.items.reduce(
              (sum: number, item: SpotifyApi.SavedTrackObject) =>
                sum + (item.track?.duration_ms ?? 0),
              0,
            ),
            numTracks: data.total,
          };

          // set updated tracks
          set(
            { usersSavedTracks: tracksToStore },
            undefined,
            "user/setUserSavedTracks",
          );
          console.log("✅ users tracks saved");

          return tracksToStore;
        },
        onDataReceived: (data) => {
          set(
            { usersSavedTracks: data },
            undefined,
            "user/setUserSavedTracksFromAPI",
          );
        },
      }),
    );
  },

  logoutUser: () =>
    set({ user: null, usersSavedTracks: null }, undefined, "user/logoutUser"),
});
