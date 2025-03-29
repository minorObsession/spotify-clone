import { getFromLocalStorage } from "../../auth/authHelpers";
import { StateStore } from "../../state/store";
import { StateCreator } from "zustand";
import { AccessTokenType } from "../auth/Auth";

export interface ArtistType {
  // name: string;
  // trackId: string;
  // imageUrl: string;
  // multipleArtists: boolean;
  // artists: string[];
  // type: string;
  // trackDuration: string;
  // releaseDate: string;
  // albumName: string;
  // albumId: string;
}

export interface ArtistSlice {
  // ! get partial types
  artist: ArtistType | null;
  getArtist: (id: string) => Promise<ArtistType | undefined>;
}

export const ArtisteTrackSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  ArtistSlice
> = (set) => ({
  artist: null,
  getArtist: async (id: string): Promise<ArtistType | undefined> => {
    try {
      const accessToken = getFromLocalStorage<AccessTokenType>("access_token");
      if (!accessToken)
        throw new Error("Access token expired or doesn't exist");

      // ! if not in LS, then fetch track
      console.log("🛜 getTrack will call api...");
      const res = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("No track or bad request");

      const data = await res.json();
      console.log(data);

      const artistObject: ArtistType = {};

      set({ artist: artistObject });

      // ! store track in LS ??? maybe session storage
      // localStorage.setItem("track", JSON.stringify(userObject));

      // ! DON'T FORGET RETURN
      return artistObject;
    } catch (err) {
      console.error("🛑 ❌", err);
      return {};
    }
  },
});
