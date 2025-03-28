import { DetailedPlaylistType } from "./playlists";
import { flexibleMillisecondsConverter } from "../../helpers/helperFunctions";

export const getPlaylistLenght = (data: DetailedPlaylistType) => {
  const rawTracks = (data as DetailedPlaylistType as { tracks: any }).tracks;
  const tracksArr = Array.isArray(rawTracks) ? rawTracks : rawTracks.items;
  return flexibleMillisecondsConverter(
    tracksArr.reduce((acc: number, track: any) => {
      acc += track.track.duration_ms;
      return acc;
    }, 0),
  );
};
