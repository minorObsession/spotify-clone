import { FaPause, FaPlay } from "react-icons/fa";
import { TrackType } from "../features/tracks/track";
import { useStateStore } from "../state/store";
import PlayingBars from "./PlayingBars";

interface TrackStatusOrIndexProps {
  track: TrackType;
  index: number;
  id: string;
  handleTrackSelect: (e: React.MouseEvent<HTMLElement | SVGElement>) => void;
  isTrackHovered: boolean;
}

function TrackStatusOrIndex({
  track,
  index,
  id,
  handleTrackSelect,
  isTrackHovered,
}: TrackStatusOrIndexProps) {
  const { playerState, togglePlayback } = useStateStore((state) => state);

  const isTrackCurrentlyQueued =
    playerState?.track_window?.current_track?.id === track?.id ||
    playerState?.track_window?.current_track?.name === track.name;

  const isTrackCurrentlyPlaying =
    isTrackCurrentlyQueued && !playerState?.paused;

  return (
    <span className="w-3">
      {isTrackCurrentlyPlaying ? (
        // * playing+hovered
        isTrackHovered ? (
          <FaPause
            size={12}
            onClick={togglePlayback}
            className="cursor-pointer"
          />
        ) : (
          // * playing, NOT hovered
          <PlayingBars />
        )
      ) : // * not playing
      isTrackHovered ? (
        // * not playing + hovered
        <FaPlay
          id={id}
          onClick={handleTrackSelect}
          size={12}
          className="cursor-pointer"
        />
      ) : (
        // * not playing + not hovered
        <span className={`${isTrackCurrentlyQueued ? "text-green-700" : ""}`}>
          {index + 1}
        </span>
      )}
    </span>
  );
}

export default TrackStatusOrIndex;
