import { FaRegCircleCheck } from "react-icons/fa6";
import { LuCirclePlus } from "react-icons/lu";
import useHoverTrackItem from "../hooks/useHoverTrackItem";
import Tooltip from "./Tooltip";
import { BiPlusCircle } from "react-icons/bi";

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
      className="relative flex justify-self-end pr-3"
    >
      {/* //!  Tooltip */}
      <Tooltip
        message={`${isInPlaylist ? "Add to Playlist" : "Add to Liked Songs"}`}
        isVisible={isHovered}
      />

      {isInPlaylist ? (
        <button className="cursor-pointer">
          <FaRegCircleCheck fill="green" />
        </button>
      ) : // ! if not in playlsit
      isTrackBoxSelected || isTrackHovered ? (
        <button className="cursor-pointer">
          <BiPlusCircle />
        </button>
      ) : null}
    </div>
  );
}

export default AddToPlaylist;
