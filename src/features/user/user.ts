import { StateCreator } from "zustand";
import { StateStore } from "../../state/store";
import { fetchFromSpotify } from "../../state/helpers";
import { DetailedPlaylistType } from "../playlists/playlists";
import { TrackType } from "../tracks/track";

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
  getUser: () => Promise<UserType | null>;
  getUserSavedTracks(offset: number): Promise<DetailedPlaylistType>;
  logoutUser: () => void;
}

let hasFetchedUser = false;

export const createUserSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  UserSlice
> = (set, get) => ({
  user: null,
  usersSavedTracks: null,
  getUser: async () => {
    if (hasFetchedUser) return get().user;
    hasFetchedUser = true;

    const userData = await fetchFromSpotify<any, UserType>({
      endpoint: "me",
      cacheName: `user_me`, // Static key, not `user_${user?.username}` (which is undefined now)
      transformFn: (data) => ({
        username: data.display_name,
        photo: data.images?.[0]?.url || "",
        userID: data.id,
        email: data.email,
      }),
      onDataReceived: (data) => {
        set({ user: data });
      },
      onCacheFound: (data) => {
        set({ user: data });
      },
    });
    console.log(userData);
    return userData;
  },
  getUserSavedTracks: async (offset = 0) => {
    const { user } = get();

    if (!get().usersSavedTracks && user?.username) {
      const local = localStorage.getItem(
        `${user?.username}s_saved_trackssssss_with_offset_of_${offset}`,
      );
      if (local) {
        const parsed = JSON.parse(local);
        set({ usersSavedTracks: parsed });
        return parsed;
      }
    }

    const result = await fetchFromSpotify<any, DetailedPlaylistType>({
      endpoint: "me/tracks",
      cacheName: `${user?.username}s_saved_tracks_with_offset_of_${offset}`,
      // ! TEMPORARY LIMIT
      offset: `?offset=${offset}&limit=10`,
      transformFn: (data) => {
        const newTracks = data.items.map(
          (item: any): TrackType => ({
            name: item.track.name,
            id: item.track.id,
            imageUrl:
              item.track.album.images.length > 0
                ? item.track.album.images[0].url
                : "",
            multipleArtists: item.track.artists.length > 1,
            artists: item.track.artists.map((artist: any) => ({
              name: artist.name,
              artistId: artist.id,
            })),
            type: item.track.type,
            trackDuration: item.track.duration_ms,
            releaseDate: item.track.album.release_date,
            albumName: item.track.album.name,
            albumId: item.track.album.id,
          }),
        );

        const currentSaved = get().usersSavedTracks;
        const mergedTracks =
          offset > 0 && currentSaved
            ? [...currentSaved.tracks, ...newTracks]
            : newTracks;

        const tracksToStore = {
          name: "Liked Songs",
          id: "liked_songs",
          type: "playlist",
          ownerName: get().user!.username,
          ownerId: get().user!.userID,
          imageUrl:
            "https://cdn.prod.website-files.com/5e36e6f21212670638c0d63c/5e39d85cee05be53d238681a_likedSongs.png",
          tracks: mergedTracks,
          totalDurationMs: 1000000, // can update if needed
          numTracks: data.total,
        };

        // set updated tracks
        set({ usersSavedTracks: tracksToStore });

        return tracksToStore;
      },
    });
    return result;
  },
  logoutUser: () => set({ user: null, usersSavedTracks: null }),
});
