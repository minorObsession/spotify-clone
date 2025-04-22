import { BiPlusCircle } from "react-icons/bi";
import { SlOptions } from "react-icons/sl";
import { IoMdPlay } from "react-icons/io";
import useHoverTrackItem from "../hooks/useHoverTrackItem";
import { TrackType } from "../features/tracks/track";
import { DetailedPlaylistType } from "../features/playlists/playlists";
import { ArtistType, TopTrackType } from "../features/artists/artist";
import useOutsideClick from "../hooks/useOutsideClick";
import { useState } from "react";
import Tooltip from "./Tooltip";
import OptionsMenu from "./OptionsMenu";

interface FPControlsProps {
  item: TrackType | TopTrackType | DetailedPlaylistType | ArtistType;
  previewType?: "artist" | "playlist" | "track";
  options: string[];
}

function FPControls({ previewType, item, options }: FPControlsProps) {
  const [areOptionsVisible, setAreOptionsVisible] = useState(false);

  const { isHovered } = useHoverTrackItem();

  const menuRef = useOutsideClick(
    setAreOptionsVisible,
  ) as React.RefObject<HTMLUListElement>;

  const handleDisplayTrackOptions = () => {
    setAreOptionsVisible(true);
  };

  return (
    // ! CONTROLS div
    <div className="flex items-center gap-5">
      <IoMdPlay
        size={54}
        fill="black"
        floodColor="red"
        className="cursor-pointer rounded-[50%] bg-green-500 p-4 transition duration-200 hover:scale-105 hover:brightness-120"
      />
      {previewType === "artist" && <button>Follow</button>}
      {previewType === "track" && (
        <BiPlusCircle
          size={24}
          fill="grey"
          className="cursor-pointer transition duration-200 hover:scale-105 hover:brightness-120"
        />
      )}{" "}
      {/* //!  Tooltip */}
      <Tooltip
        message={`See more options for ${item.name}`}
        isVisible={isHovered && !areOptionsVisible}
      />
      {/* // ! dots */}
      <SlOptions
        onClick={handleDisplayTrackOptions}
        size={24}
        fill="grey"
        className="cursor-pointer transition duration-200 hover:scale-105 hover:brightness-120"
      />
      {/* // ! menu    */}
      <OptionsMenu
        ref={menuRef}
        areOptionsVisible={areOptionsVisible}
        options={options}
      />
    </div>
  );
}

export default FPControls;
