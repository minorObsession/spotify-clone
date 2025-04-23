import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import { useStateStore } from "../state/store";

function PlayButton() {
  const {
    togglePlayback,
    playerState: { paused },
  } = useStateStore((state) => state);

  return (
    <button onClick={togglePlayback}>
      {paused ? <FaPlayCircle /> : <FaPauseCircle />}
    </button>
  );
}

export default PlayButton;
