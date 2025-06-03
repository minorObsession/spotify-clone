import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useScreenWidthRem } from "./useScreenWidthRem";
import { TrackType } from "../features/tracks/track";
import { TopTrackType } from "../features/artists/artist";
import { flexibleMillisecondsConverter } from "../helpers/helperFunctions";
import { useStateStore } from "../state/store";

export function useTrackItem(track: TrackType | TopTrackType) {
  const navigate = useNavigate();
  const { screenWidth: screenWidthRem } = useScreenWidthRem();
  const [isTrackBoxSelected, setIsTrackBoxSelected] = useState(false);
  const [isTrackHovered, setIsTrackHovered] = useState(false);

  const trackName = track?.name;
  const params = useParams();
  const trackDurationFormatted = flexibleMillisecondsConverter(
    track?.trackDuration,
  )
    .split("min")
    .map((el, i) => {
      if (i === 0) return el + ":";
      if (i === 1) {
        const sec = el.replace("s", "").trim();
        return sec.padStart(2, "0");
      }
      return el;
    });

  const { playTrack } = useStateStore.getState();

  const thumbnailUrl = track?.imageUrl;

  const handleTrackSelect = (
    e: React.MouseEvent<HTMLElement | SVGElement>,
    trackIndex = 0,
  ) => {
    // if clicked on SVG (play btn)
    if (e.currentTarget instanceof SVGElement) {
      // check if we're on a playlist page
      const playlistId = params.id;
      // console.log(window.location.pathname);
      // * if id exists
      if (playlistId) {
        // * if in liked songs
        if (playlistId === "liked_songs") {
          // find the id of the liked song by index
          const likedSongs = useStateStore.getState().usersSavedTracks!;
          const trackId = likedSongs.tracks[trackIndex].id;
          playTrack(`spotify:track:${trackId}`, "track");
          return;
        }
        playTrack(`spotify:playlist:${playlistId}`, "playlist", trackIndex);
      }
      // * if not on any playlist page - just queue the track
      else playTrack(`spotify:playlist:${e.currentTarget.id}`, "track");
    } else {
      navigate(`/home/track/${e.currentTarget.id}`);
    }
  };

  return {
    screenWidthRem,
    isTrackBoxSelected,
    setIsTrackBoxSelected,
    isTrackHovered,
    setIsTrackHovered,
    trackName,
    trackDurationFormatted,
    thumbnailUrl,
    handleTrackSelect,
  };
}
