import { FaPlus } from "react-icons/fa";
import useHoverTrackItem from "../hooks/useHoverTrackItem";
import OptionItem from "./OptionItem";
import { useStateStore } from "../state/store";
import { TrackType } from "../features/tracks/track";
import { RequireAtLeastOne } from "../types/requireAtLeastOneProp";
import { getPositioningClasses } from "../helpers/helperFunctions";

export type MenuFor =
  | "userAvatar"
  | "playlist"
  | "track"
  | "addToPlaylist"
  | "podcast"
  | "artist"
  | "album";

type OptionsMenuProps = {
  options: string[];
  menuFor: MenuFor;
  ref: React.RefObject<HTMLUListElement>;
  areOptionsVisible: boolean;
  setAreOptionsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  directionOfMenu?:
    | "topLeft"
    | "bottomLeft"
    | "topRight"
    | "bottomRight"
    | "extendToRight"
    | "extendToLeft";
  onOptionClick?: (option: string) => void;
} & RequireAtLeastOne<{
  track: TrackType;
  selectedTrackId: string;
}>;

function OptionsMenu({
  ref,
  directionOfMenu = "topLeft",
  areOptionsVisible,
  setAreOptionsVisible,
  menuFor,
  options,
  track,
  onOptionClick,
}: OptionsMenuProps) {
  const { handleMouseEnter, handleMouseLeave } = useHoverTrackItem();

  const handleDisplayOptions = () => {
    setAreOptionsVisible(true);
  };

  const handleCreateNewPlaylist = async () => {
    try {
      if (!track) return;

      const { createNewPlaylist } = useStateStore.getState();

      const result = await createNewPlaylist(
        track.name,
        track.id,
        track.imageUrl,
      );

      if (result.success) {
        console.log("✅ Playlist created successfully");
        // TODO: Show success toast/notification
        // State is automatically updated by createNewPlaylist function
      } else {
        console.error("❌ Error creating playlist:", result.error);
        // TODO: Show error toast/notification to user
        // Example: showToast("Failed to create playlist", "error");
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      // TODO: Show error toast/notification to user
    }
  };

  // if (!track) return null;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleDisplayOptions}
      className="relative justify-self-end"
    >
      <ul
        ref={ref}
        className={`absolute ${getPositioningClasses(directionOfMenu)} z-10 max-h-80 overflow-y-auto rounded-md bg-amber-200 p-1 text-sm text-nowrap shadow-md ${areOptionsVisible ? "inline" : "hidden"}`}
      >
        {menuFor === "addToPlaylist" && (
          <>
            <h3 className="mb-2 font-bold">Add to playlist</h3>
            <button
              onClick={handleCreateNewPlaylist}
              className="mb-2 flex w-full items-center rounded-md bg-amber-400 p-2 text-left text-base font-bold hover:cursor-pointer hover:bg-amber-500"
            >
              <FaPlus className="mr-3" /> New playlist
            </button>
          </>
        )}

        {/* // *** HERE! TRYUING TO GET TRACK ID  */}
        {/* // *** HERE! TRYUING TO GET TRACK ID  */}
        {/* // *** HERE! TRYUING TO GET TRACK ID  */}
        {/* // *** HERE! TRYUING TO GET TRACK ID  */}
        {options.map((option, i) => (
          // ! pass track id here!!! to determine if track is already in playlist
          <OptionItem
            menuFor={menuFor}
            option={option}
            key={`${option}-${i}`}
            selectedTrackId={track?.id || ""}
            onOptionClick={onOptionClick}
          />
        ))}
      </ul>
    </div>
  );
}

export default OptionsMenu;
