import { ArtistType } from "./artist";

export const isArtist = (item: any): item is ArtistType => {
  return "numFollowers" in item; // adjust based on your structure
};
