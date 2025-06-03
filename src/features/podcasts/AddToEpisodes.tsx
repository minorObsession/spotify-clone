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
  const isEpisodeSaved = useStateStore((store) => store.isEpisodeSaved(id));

  const handleAddToLikedEpisodes = () => {
    // updateZustand store - optimistic update UI
    addEpisodeToLikedEpisodes(episode);

    // update local storage
    saveToLocalStorage(
      `${useStateStore.getState().user?.username}s_liked_episodes`,
      [episode],
    );

    // localStorage.setItem(
    //   `${useStateStore.getState().user?.username}s_liked_episodes`,
    //   JSON.stringify([
    //     episode,
    //     ...JSON.parse(
    //       localStorage.getItem(
    //         `${useStateStore.getState().user?.username}s_liked_episodes`,
    //       ) || "[]",
    //     ),
    //   ]),
    // );
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleAddToLikedEpisodes}
      className="relative flex"
    >
      <Tooltip message="Save to Your Episodes" isVisible={isHovered} />

      <button className="cursor-pointer">
        {isEpisodeSaved ? (
          <FaCircleCheck fill="green" />
        ) : (
          <span className={``}>
            <BiPlusCircle />
          </span>
        )}
      </button>
    </div>
  );
}

export default AddToEpisodes;
