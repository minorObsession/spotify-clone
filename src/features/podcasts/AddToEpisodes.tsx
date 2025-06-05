import { BiPlusCircle } from "react-icons/bi";
import useHoverTrackItem from "../../hooks/useHoverTrackItem";
import Tooltip from "../../components/Tooltip";
import { PodcastEpisodeType } from "./podcast";
import { useStateStore } from "../../state/store";
import { FaCircleCheck } from "react-icons/fa6";

interface AddToEpisodesProps {
  episode: PodcastEpisodeType;
  id: string;
  isEpisodeHovered: boolean;
}

function AddToEpisodes({ episode, id, isEpisodeHovered }: AddToEpisodesProps) {
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverTrackItem();
  const addEpisodeToLikedEpisodes = useStateStore(
    (store) => store.addEpisodeToLikedEpisodes,
  );
  const removeEpisodeFromLikedEpisodes = useStateStore(
    (store) => store.removeEpisodeFromLikedEpisodes,
  );
  const isEpisodeSaved = useStateStore((store) => store.isEpisodeSaved(id));

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex"
    >
      <Tooltip
        message={`${isEpisodeSaved ? "Remove from" : "Save to"} Your Episodes`}
        isVisible={isHovered}
      />

      <button className="cursor-pointer">
        {isEpisodeSaved ? (
          <FaCircleCheck
            fill="green"
            onClick={() => removeEpisodeFromLikedEpisodes(id)}
          />
        ) : (
          <span className={``}>
            <BiPlusCircle onClick={() => addEpisodeToLikedEpisodes(episode)} />
          </span>
        )}
      </button>
    </div>
  );
}

export default AddToEpisodes;
