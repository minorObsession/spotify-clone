import { flexibleMillisecondsConverter } from "../../helpers/helperFunctions";
import { useStateStore } from "../../state/store";
import { TrackType } from "../tracks/track";

export const getPlaylistLenght = (data: TrackType[]) => {
  console.log(data);
  return flexibleMillisecondsConverter(
    data.reduce((acc: number, track: TrackType) => {
      acc += +track.trackDuration;
      return acc;
    }, 0),
  );
};

export const isTrackInLibrary = (trackId: string) =>
  useStateStore
    .getState()
    .playlistNamesWithTrackIds.some((playlist) =>
      playlist.trackIds?.includes(trackId),
    );
