import useHoverTrackItem from "../hooks/useHoverTrackItem";
import OptionItem from "./OptionItem";

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
  selectedTrackId: string;
}

function OptionsMenu({
  ref,
  directionOfMenu = "topLeft",
  areOptionsVisible,
  menuFor,
  options,
  selectedTrackId,
}: OptionsMenuProps) {
  const { handleMouseEnter, handleMouseLeave } = useHoverTrackItem();

  const handleDisplayOptions = () => {
    areOptionsVisible = true;
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleDisplayOptions}
      className="relative justify-self-end"
    >
      <ul
        ref={ref}
        className={`absolute p-2 ${directionOfMenu === "bottomLeft" ? "-left-20" : "-right-4"} ${directionOfMenu === "bottomLeft" ? "top-2" : "bottom-2"} z-10 rounded-md bg-amber-200 p-1 text-xs text-nowrap shadow-md ${areOptionsVisible ? "inline" : "hidden"}`}
      >
        {options.map((option) => (
          // menuFor
          <OptionItem
            menuFor={menuFor}
            option={option}
            key={option}
            selectedTrackId={selectedTrackId}
          />
        ))}
      </ul>
    </div>
  );
}

export default OptionsMenu;
