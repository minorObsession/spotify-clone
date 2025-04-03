import { useState } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";
import { SlOptions } from "react-icons/sl";
import useHoverTrackItem from "../../hooks/useHoverTrackItem";
import Tooltip from "../../components/Tooltip";

interface TrackOptionsProps {
  options: string[];
  artistsToDisplay?: string[];
  isTrackBoxSelected: boolean;
  setIsTrackBoxSelected: React.Dispatch<React.SetStateAction<boolean>>;
  isTrackHovered: boolean;
  trackName: string;
}

function TrackOptions({
  setIsTrackBoxSelected,
  artistsToDisplay,
  isTrackBoxSelected,
  isTrackHovered,
  trackName,
  options,
}: TrackOptionsProps) {
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverTrackItem();

  const [areOptionsVisible, setAreOptionsVisible] = useState(false);
  const menuRef = useOutsideClick(setAreOptionsVisible, setIsTrackBoxSelected);

  // Use the hover hook

  const handleDisplayTrackOptions = () => {
    setAreOptionsVisible(true);
  };

  return (
    // ! container
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleDisplayTrackOptions}
      className="relative justify-self-end"
    >
      {/* //!  Tooltip */}
      <Tooltip
        message={`See more options for ${trackName} by ${artistsToDisplay}`}
        isVisible={isHovered && !areOptionsVisible}
      />
      {/* // ! options menu */}
      <ul
        ref={menuRef}
        className={`absolute -right-4 bottom-7 z-10 rounded-md bg-amber-200 p-1 text-xs text-nowrap shadow-md ${areOptionsVisible ? "inline" : "hidden"}`}
      >
        {options.map((option) => (
          <li>{option}</li>
        ))}
      </ul>
      {/* Dots Icon */}
      <span className="justify-self-start hover:cursor-pointer">
        {(isTrackHovered && !areOptionsVisible) || isTrackBoxSelected ? (
          <SlOptions />
        ) : null}
      </span>
    </div>
  );
}

export default TrackOptions;
