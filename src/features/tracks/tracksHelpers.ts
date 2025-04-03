import { DetailedPlaylistType } from "../playlists/playlists";
import { TrackType } from "./track";

export const isDataPlaylist = (
  data: DetailedPlaylistType | TrackType,
): data is DetailedPlaylistType => {
  return "tracks" in data;
};
export const isDataTrack = (
  data: DetailedPlaylistType | TrackType,
): data is TrackType => {
  return "trackId" in data;
};
export const getDataType = (data: DetailedPlaylistType | TrackType) => {
  if (isDataPlaylist(data)) return "playlist";
  if (isDataTrack(data)) return "track";
  return "unknown";
};

