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

export const isTrackInLibrary = (id: string) => {
  // check userPlaylists
  // check userSaved tracks

  const savedTracks = useStateStore.getState().usersSavedTracks;
  if (!savedTracks) throw new Error("no saved tracsk");
  const idsFromLikedSongs = savedTracks.tracks.map((track) => track.id);

  const idsFromUserPlaylists = useStateStore
    .getState()
    .playlists.map((playlist) => playlist.id);

  const allIds = [...idsFromLikedSongs, ...idsFromUserPlaylists];

  return allIds.some((trackId) => trackId === id);
};
