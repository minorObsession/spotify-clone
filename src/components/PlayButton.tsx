import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import { useStateStore } from "../state/store";

function PlayButton() {
  const { togglePlayback, playerState } = useStateStore((state) => state);

  return (
    <button onClick={togglePlayback}>
      {playerState?.paused ? <FaPlayCircle /> : <FaPauseCircle />}
    </button>
  );
}

export default PlayButton;
