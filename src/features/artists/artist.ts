import { getFromLocalStorage } from "../../auth/authHelpers";
import { StateStore } from "../../state/store";
import { StateCreator } from "zustand";
import { AccessTokenType } from "../auth/Auth";

export interface ArtistType {
  artistName: string;
  genres: string[];
  artistID: string;
  type: string;
  numFollowers: number;
  imageUrl: string;
}

export interface ArtistSlice {
  // ! get partial types
  artist: ArtistType | null;
  getArtist: (id: string) => Promise<ArtistType | undefined>;
}

export const createArtistSlice: StateCreator<
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

      const artistFromLS = getFromLocalStorage<ArtistType>(`artist_${id}`);

      if (artistFromLS) {
        set({ artist: artistFromLS });
        return artistFromLS;
      }

      // ! if not in LS, then fetch artist
      console.log("🛜 getArtist will call api...");
      const res = await fetch(`https://api.spotify.com/v1/artists/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("No track or bad request");

      const data = await res.json();

      const artistObject: ArtistType = {
        artistName: data.name,
        genres: data.genres,
        artistID: data.id,
        type: data.type,
        numFollowers: data.followers.total,
        imageUrl: data.images[0].url,
      };

      set({ artist: artistObject });

      // ! store artist in LS ??? maybe session storage
      localStorage.setItem(`artist_${id}`, JSON.stringify(artistObject));

      // ! DON'T FORGET RETURN
      return artistObject;
    } catch (err) {
      console.error("🛑 ❌", err);
    }
  },
});
