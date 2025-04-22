import { flexibleMillisecondsConverter } from "../../helpers/helperFunctions";
import { useStateStore } from "../../state/store";
import { TrackType } from "../tracks/track";

export const getPlaylistLenght = (data: TrackType[]) => {
  return flexibleMillisecondsConverter(
    data.reduce((acc: number, track: TrackType) => {
      acc += +track.trackDuration;
      return acc;
    }, 0),
  );
};

export const isTrackInLibrary = (id: string) =>
  useStateStore
    .getState()
    .playlistNamesWithids.some((playlist) =>
      playlist.ids?.includes(id),
    );
