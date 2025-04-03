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
      playlist.trackIds.includes(trackId),
    );

console.log(isTrackInLibrary("32JI8GciZ1vtZDA6ZA1p5r"));

// open a playlist

// get the trackIds array (all tracksIds)

// serach trackIDs against all the trackIds in user's playlists

//
