import { BiPlusCircle } from "react-icons/bi";
import useHoverTrackItem from "../../hooks/useHoverTrackItem";
import Tooltip from "../../components/Tooltip";
import { PodcastEpisodeType } from "./podcast";
import { useStateStore } from "../../state/store";
import { FaCircleCheck } from "react-icons/fa6";
import { saveToLocalStorage } from "../auth/authHelpers";

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

  const handleAddToLikedEpisodes = () => {
    // updateZustand store - optimistic update UI

    addEpisodeToLikedEpisodes(episode);

    // update local storage
    saveToLocalStorage(
      `${useStateStore.getState().user?.username}s_liked_episodes`,
      episode,
    );
  };

  const handleRemoveFromLikedEpisodes = () => {
    // updateZustand store - optimistic update UI
    removeEpisodeFromLikedEpisodes(id);
  };

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
          <FaCircleCheck fill="green" onClick={handleRemoveFromLikedEpisodes} />
        ) : (
          <span className={``}>
            <BiPlusCircle onClick={handleAddToLikedEpisodes} />
          </span>
        )}
      </button>
    </div>
  );
}

export default AddToEpisodes;
