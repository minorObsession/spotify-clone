import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import { useStateStore } from "../state/store";

interface PlayButtonProps {
  onClick?: () => void;
}

function PlayButton({ onClick }: PlayButtonProps) {
  const { togglePlayback, playerState } = useStateStore((state) => state);

  return (
    <button onClick={onClick || togglePlayback}>
      {playerState?.paused ? <FaPlayCircle /> : <FaPauseCircle />}
    </button>
  );
}

export default PlayButton;
