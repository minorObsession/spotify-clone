import { useState } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";
import { SlOptions } from "react-icons/sl";

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
  const [areOptionsHovered, setAreOptionsHovered] = useState(false);
  const [areOptionsVisible, setAreOptionsVisible] = useState(false);
  const menuRef = useOutsideClick(setAreOptionsVisible, setIsTrackBoxSelected);

  const handleDisplayTrackOptions = () => {
    setAreOptionsHovered(false);
    setAreOptionsVisible(true);
  };

  return (
    <div
      onMouseEnter={() => !areOptionsVisible && setAreOptionsHovered(true)}
      onMouseLeave={() => setAreOptionsHovered(false)}
      onClick={handleDisplayTrackOptions}
      className="relative justify-self-end"
    >
      {/* // ! options hover */}
      <span
        className={`absolute -right-4 bottom-7 z-12 rounded-md bg-amber-200 p-1 text-xs text-nowrap shadow-md ${areOptionsHovered ? "inline" : "hidden"}`}
      >
        see more options for {trackName} by {artistsToDisplay}
      </span>
      {/* // ! options menu */}
      <ul
        ref={menuRef}
        className={`absolute -right-4 bottom-7 z-10 rounded-md bg-amber-200 p-1 text-xs text-nowrap shadow-md ${areOptionsVisible ? "inline" : "hidden"}`}
      >
        {options.map((option) => (
          <li>{option}</li>
        ))}
      </ul>

      {/* // ! dots to display menu  */}
      <span className="justify-self-start hover:cursor-pointer">
        {(isTrackHovered && !areOptionsVisible) || isTrackBoxSelected ? (
          <SlOptions />
        ) : (
          ""
        )}
      </span>
    </div>
  );
}

export default TrackOptions;
