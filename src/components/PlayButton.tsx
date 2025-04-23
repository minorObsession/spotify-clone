import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";
import { useStateStore } from "../state/store";

function PlayButton() {
  const { togglePlayback, isPlaying } = useStateStore((state) => state);

  return (
    <button onClick={togglePlayback}>
      {isPlaying ? <FaPauseCircle /> : <FaPlayCircle />}
    </button>
  );
}

export default PlayButton;
