import { FaCircleCheck } from "react-icons/fa6";
import useHoverTrackItem from "../hooks/useHoverTrackItem";
import Tooltip from "./Tooltip";
import { BiPlusCircle } from "react-icons/bi";
import { isTrackInLibrary } from "../features/playlists/playlistHelpers";

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

  // ! look for this ID in all playlists - make function that does this

  const isTheTrackInLibrary = isTrackInLibrary(trackId);

  return (
    // ! container
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => handleAddToPlaylist(trackId)}
      className="relative flex"
    >
      {/* //!  Tooltip */}
      <Tooltip
        message={`${isTheTrackInLibrary ? "Add to Playlist" : "Add to Liked Songs"}`}
        isVisible={isHovered}
      />

      {isTheTrackInLibrary ? (
        <button className="cursor-pointer">
          <FaCircleCheck fill="green" />
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
