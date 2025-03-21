import { getAccessToken } from "../auth/authHelpers";
import { StateStore } from "./store";
import { StateCreator } from "zustand";

export interface RecommendationsSlice {
  recTracks: Record<string, any>[];
  getRecTracks: () => Promise<void>;
}

export const createRecommendationsSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  RecommendationsSlice
> = (set) => ({
  recTracks: [],
  getRecTracks: async () => {
    try {
      const accessToken = getAccessToken();

      if (!accessToken)
        throw new Error("Access token expired or doesn't exist");

      const res = await fetch(
        "https://api.spotify.com/v1/recommendations?seed_artists=4NHQUGzhtTLFvgF5SZesLK",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken.token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!res.ok) throw new Error("No recommendations or bad request");

      const recs = await res.json();
      console.log(recs);
      // set({
      //   recTracks: [...recs],
      // });

      return recs;
    } catch (err) {
      console.error("🛑 ❌", err);
    }
  },
});
