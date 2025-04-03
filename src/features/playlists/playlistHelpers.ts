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

export const isTrackInLibrary = (trackId: string): boolean =>
  useStateStore
    .getState()
    .playlistNamesWithTrackIds.some((playlist) =>
      playlist.trackIDs.includes(trackId),
    );

console.log(isTrackInLibrary("0X8f3qbbZAmWy0LFtUkznl"));

// open a playlist

// get the trackIds array (all tracksIds)

// serach trackIDs against all the trackIds in user's playlists

//
