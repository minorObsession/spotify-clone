import { FaRegCircleCheck } from "react-icons/fa6";
import { LuCirclePlus } from "react-icons/lu";
import useHoverTrackItem from "../hooks/useHoverTrackItem";
import Tooltip from "./Tooltip";

interface AddToPlaylistProps {
  trackId: string;
  isTrackHovered: boolean;
  isTrackBoxSelected: boolean;
}

function AddToPlaylist({
  trackId,
  isTrackHovered,
  isTrackBoxSelected,
}: AddToPlaylistProps) {
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverTrackItem();

  const handleAddToPlaylist = (id: any) => {
    console.log("adding..:", id);
  };
  // ! WORKING ON BOOLEAN LOGIC HERE!!!
  // ! WORKING ON BOOLEAN LOGIC HERE!!!
  // ! WORKING ON BOOLEAN LOGIC HERE!!!
  // ! WORKING ON BOOLEAN LOGIC HERE!!!

  // ! look for this ID in all playlists - make function that does this
  const isInPlaylist = true;
  return (
    // ! container
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => handleAddToPlaylist(trackId)}
      className="relative justify-self-end pr-3"
    >
      {/* //!  Tooltip */}
      <Tooltip
        message={`${isInPlaylist ? "Add to Playlist" : "Add to Liked Songs"}`}
        isVisible={isHovered}
      />
      <span className="">
        {isTrackHovered || isTrackBoxSelected ? (
          <button className="cursor-pointer">
            {isInPlaylist ? (
              <FaRegCircleCheck fill="green" />
            ) : (
              // ! if not in playlist, only show icon when hovered
              isTrackBoxSelected && <LuCirclePlus />
            )}
          </button>
        ) : null}
      </span>
      {/* <LuCirclePlus /> */}
    </div>
  );
}

export default AddToPlaylist;
