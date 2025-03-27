import { getFromLocalStorage } from "../auth/authHelpers";
import { AccessTokenType } from "./Auth.z";
import { StateStore } from "./store";
import { StateCreator } from "zustand";

export interface TrackType {
  title: string;
  photoUrl: string;
  multipleArtists: boolean;
  artist: string[];
  artistsMonthlyListeners: number;
}

export interface TrackSlice {
  // ! get partial types
  user: TrackType | null;
  getTrack: (id) => Promise<TrackType>;
}

export const createTrackSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  TrackSlice
> = (set) => ({
  user: null,
  getTrack: async (id: string): Promise<TrackType> => {
    try {
      const accessToken = getFromLocalStorage<AccessTokenType>("access_token");
      if (!accessToken)
        throw new Error("Access token expired or doesn't exist");

      // ! check LS for user
      // * potential problem if switched to different user - need a better validation
      // const storedUser = getFromLocalStorage<TrackType>("user");

      // if (storedUser) {
      //   set({ user: storedUser });
      //   return storedUser;
      // }

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
      // const userObject: TrackType = {
      //   // title: string;
      //   // photoUrl: string;
      //   // multipleArtists: boolean;
      //   // artist: string[];
      //   // artistsMonthlyListeners: number;
      // };

      // set({ user: userObject });

      // ! store track in LS ??? maybe session storage
      // localStorage.setItem("user", JSON.stringify(userObject));

      // ! DON'T FORGET RETURN
      // return userObject;
    } catch (err) {
      console.error("🛑 ❌", err);
      return {
        title: "",
        photoUrl: "",
        multipleArtists: false,
        artist: [],
        artistsMonthlyListeners: 0,
      };
    }
  },
});
