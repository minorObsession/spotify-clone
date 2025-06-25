import { FaPlus } from "react-icons/fa";
import useHoverTrackItem from "../hooks/useHoverTrackItem";
import OptionItem from "./OptionItem";
import { useStateStore } from "../state/store";
import { TrackType } from "../features/tracks/track";

export type MenuFor =
  | "userAvatar"
  | "playlist"
  | "track"
  | "addToPlaylist"
  | "podcast";

interface OptionsMenuProps {
  options: string[];
  menuFor: MenuFor;
  ref: React.RefObject<HTMLUListElement>;
  areOptionsVisible: boolean;
  directionOfMenu?: "topLeft" | "bottomLeft";
  track?: TrackType;
}

function OptionsMenu({
  ref,
  directionOfMenu = "topLeft",
  areOptionsVisible,
  menuFor,
  options,
  track,
}: OptionsMenuProps) {
  const { handleMouseEnter, handleMouseLeave } = useHoverTrackItem();

  const handleDisplayOptions = () => {
    areOptionsVisible = true;
  };

  // no need for try catch here because errors are handled by createNewPlaylist function in state slice
  const handleCreateNewPlaylist = async () => {
    if (!track) return;

    const { createNewPlaylist } = useStateStore.getState();

    const result = await createNewPlaylist(track.name, track.id);

    if (result.success) {
      console.log("✅ Playlist created successfully");
      // TODO: Show success toast/notification
      // State is automatically updated by createNewPlaylist function
    } else {
      console.error("❌ Failed to create playlist:", result.error);
      // TODO: Show error toast/notification to user
      // Example: showToast("Failed to create playlist", "error");
    }
  };

  if (!track) return null;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleDisplayOptions}
      className="relative justify-self-end"
    >
      <ul
        ref={ref}
        className={`absolute p-2 ${directionOfMenu === "bottomLeft" ? "-left-20" : "-right-4"} ${directionOfMenu === "bottomLeft" ? "top-2" : "bottom-2"} z-10 max-h-80 overflow-y-auto rounded-md bg-amber-200 p-1 text-sm text-nowrap shadow-md ${areOptionsVisible ? "inline" : "hidden"}`}
      >
        <h3 className="mb-2 font-bold">Add to playlist</h3>
        <button
          onClick={handleCreateNewPlaylist}
          className="mb-2 flex w-full items-center rounded-md bg-amber-400 p-2 text-left text-base font-bold hover:cursor-pointer hover:bg-amber-500"
        >
          <FaPlus className="mr-3" /> New playlist
        </button>
        {options.map((option) => (
          // menuFor
          <OptionItem
            menuFor={menuFor}
            option={option}
            key={option}
            selectedTrackId={track.id}
          />
        ))}
      </ul>
    </div>
  );
}

export default OptionsMenu;
