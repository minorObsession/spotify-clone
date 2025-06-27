import { useState } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";
import { SlOptions } from "react-icons/sl";
import useHoverTrackItem from "../../hooks/useHoverTrackItem";
import Tooltip from "../../components/Tooltip";
import OptionsMenu from "../../components/OptionsMenu";
import { TrackType } from "./track";

interface TrackOptionsProps {
  options: string[];
  artistsToDisplay?: string[];
  isTrackBoxSelected: boolean;
  setIsTrackBoxSelected: React.Dispatch<React.SetStateAction<boolean>>;
  isTrackHovered: boolean;
  trackName: string;
  track: TrackType;
}

function TrackOptions({
  setIsTrackBoxSelected,
  artistsToDisplay,
  isTrackBoxSelected,
  isTrackHovered,
  trackName,
  options,
  track,
}: TrackOptionsProps) {
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverTrackItem();
  const [areOptionsVisible, setAreOptionsVisible] = useState(false);
  const menuRef = useOutsideClick<HTMLUListElement>(
    setAreOptionsVisible,
    setIsTrackBoxSelected,
  ) as React.RefObject<HTMLUListElement>;

  const handleDisplayTrackOptions = () => {
    console.log("handleDisplayTrackOptions");
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
      <OptionsMenu
        menuFor="track"
        ref={menuRef}
        areOptionsVisible={areOptionsVisible}
        setAreOptionsVisible={setAreOptionsVisible}
        options={options}
        track={track}
      />
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
