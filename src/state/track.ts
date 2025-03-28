import { getFromLocalStorage } from "../auth/authHelpers";
import { flexibleMillisecondsConverter } from "../helpers/helperFunctions";
import { AccessTokenType } from "./Auth.z";
import { StateStore } from "./store";
import { StateCreator } from "zustand";

export interface TrackType {
  name: string;
  trackId: string;
  imageUrl: string;
  multipleArtists: boolean;
  artists: string[];
  type: string;
  trackDuration: string;
  releaseDate: string;
  albumName: string;
  albumId: string;
}

export interface TrackSlice {
  // ! get partial types
  track: TrackType | null;
  getTrack: (id: string) => Promise<TrackType | undefined>;
}

export const createTrackSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  TrackSlice
> = (set) => ({
  track: null,
  getTrack: async (id: string): Promise<TrackType | undefined> => {
    try {
      const accessToken = getFromLocalStorage<AccessTokenType>("access_token");
      if (!accessToken)
        throw new Error("Access token expired or doesn't exist");

      // ! if not in LS, then fetch track
      console.log("🛜 getTrack will call api...");
      const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("No track or bad request");

      const data = await res.json();
      console.log(data);

      const trackObject: TrackType = {
        name: data.name,
        type: data.type,
        trackId: data.id,
        imageUrl: data.album.images[0].url,
        multipleArtists: data.artists.length > 1,
        artists: data.artists.map((artist: any) => artist.name),
        trackDuration: flexibleMillisecondsConverter(data.duration_ms),
        releaseDate: data.album.release_date,
        albumName: data.album.name,
        albumId: data.album.id,
      };

      set({ track: trackObject });

      // ! store track in LS ??? maybe session storage
      // localStorage.setItem("track", JSON.stringify(userObject));

      // ! DON'T FORGET RETURN
      return trackObject;
    } catch (err) {
      console.error("🛑 ❌", err);
      return {
        name: "",
        trackId: "",
        imageUrl: "",
        multipleArtists: false,
        artists: [],
        type: "",
        trackDuration: "",
        releaseDate: "",
        albumName: "",
        albumId: "",
        // artistsMonthlyListeners: 0,
      };
    }
  },
});
