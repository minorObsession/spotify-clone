import { flexibleMillisecondsConverter } from "../../helpers/helperFunctions";
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
