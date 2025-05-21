import { flexibleMillisecondsConverter } from "../../helpers/helperFunctions";
import { useStateStore } from "../../state/store";
import { TrackType } from "../tracks/track";
import { PlaylistNamesWithidsType } from "./playlists";

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

  const idsFromLikedSongs = (savedTracks.tracks || [])
    .filter((track): track is { id: string } => !!track?.id)
    .map((track) => track.id);

  const idsFromUserPlaylists: string[] = useStateStore
    .getState()
    .playlistNamesWithids.reduce(
      (acm: string[], p: PlaylistNamesWithidsType) => {
        p.ids.forEach((id: string) => acm.push(id));
        return acm;
      },
      [],
    );

  const allIds = [...idsFromLikedSongs, ...idsFromUserPlaylists];

  return allIds.some((trackId) => trackId === id);
};
