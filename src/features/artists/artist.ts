import { getFromLocalStorage } from "../../auth/authHelpers";
import { StateStore } from "../../state/store";
import { StateCreator } from "zustand";
import { AccessTokenType } from "../auth/Auth";
import { TrackType } from "../tracks/track";
import { flexibleMillisecondsConverter } from "../../helpers/helperFunctions";

export interface ArtistType {
  artistName: string;
  genres: string[];
  artistID: string;
  type: string;
  numFollowers: number;
  imageUrl: string;
  topTracks: TopTrackType[];
}

type TopTrackType = Omit<
  TrackType,
  | "albumName"
  | "multipleArtists"
  | "albumId"
  | "type"
  | "artists"
  | "topTracks"
  | "releaseDate"
>;
export interface ArtistSlice {
  // ! get partial types
  artist: ArtistType | null;
  getArtist: (id: string) => Promise<ArtistType | undefined>;
  getTopTracks: (id: string) => Promise<TopTrackType[] | undefined>;
}

export const createArtistSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  ArtistSlice
> = (set, get) => ({
  artist: null,
  getTopTracks: async (id: string): Promise<TopTrackType[] | undefined> => {
    try {
      const accessToken = getFromLocalStorage<AccessTokenType>("access_token");
      if (!accessToken)
        throw new Error("Access token expired or doesn't exist");

      // ! if not in LS, then fetch artist
      console.log("🛜 getTopTracks will call api...");
      const res = await fetch(
        `https://api.spotify.com/v1/artists/${id}/top-tracks`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken.token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) throw new Error("No top tracks or bad request");

      const data = await res.json();
      console.log(data);

      const arrayToReturn: TopTrackType[] = [];

      let topTrackObject: TopTrackType;

      data.tracks.map((track: any) => {
        topTrackObject = {
          name: "",
          trackId: "",
          imageUrl: "",
          trackDuration: "",
        };
        topTrackObject.name = track.name;
        topTrackObject.trackId = track.id;
        topTrackObject.imageUrl = track.album.images[0];
        topTrackObject.trackDuration = flexibleMillisecondsConverter(
          track.duration_ms,
        );
        arrayToReturn.push(topTrackObject);
      });

      // ! store artist in LS ??? maybe session storage
      // localStorage.setItem(`artist_${id}`, JSON.stringify(topTracksObject));

      // ! DON'T FORGET RETURN
      console.log("BEFORE RETURNING", arrayToReturn);
      return arrayToReturn;
      // return data.tracks;
    } catch (err) {
      console.error("🛑 ❌", err);
      return [];
    }
  },
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

      // ! get top tracks
      const topTracks = await get().getTopTracks(id);
      if (!topTracks) throw new Error("No top tracks or bad request");

      const artistObject: ArtistType = {
        artistName: data.name,
        genres: data.genres,
        artistID: data.id,
        type: data.type,
        numFollowers: data.followers.total,
        imageUrl: data.images[0].url,
        topTracks,
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
