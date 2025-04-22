import { useState } from "react";
import { useNavigate } from "react-router";
import { useScreenWidthRem } from "./useScreenWidthRem";
import { TrackType } from "../features/tracks/track";
import { TopTrackType } from "../features/artists/artist";
import { flexibleMillisecondsConverter } from "../helpers/helperFunctions";

export function useTrackItem(track: TrackType | TopTrackType) {
  const navigate = useNavigate();
  const { screenWidth: screenWidthRem } = useScreenWidthRem();
  const [isTrackBoxSelected, setIsTrackBoxSelected] = useState(false);
  const [isTrackHovered, setIsTrackHovered] = useState(false);

  const trackName = track.name;
  const trackDurationFormatted = flexibleMillisecondsConverter(
    track.trackDuration,
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

  const thumbnailUrl = track.imageUrl;

  const handleTrackSelect = (e: React.MouseEvent<HTMLElement>) => {
    navigate(`/home/track/${e.currentTarget.id}`);
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
