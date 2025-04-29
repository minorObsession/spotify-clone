import { BiPlusCircle } from "react-icons/bi";
import { SlOptions } from "react-icons/sl";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import useHoverTrackItem from "../hooks/useHoverTrackItem";
import { TrackType } from "../features/tracks/track";
import { DetailedPlaylistType } from "../features/playlists/playlists";
import { ArtistType, TopTrackType } from "../features/artists/artist";
import useOutsideClick from "../hooks/useOutsideClick";
import { memo, useState } from "react";
import Tooltip from "./Tooltip";
import OptionsMenu from "./OptionsMenu";

import { useStateStore } from "../state/store";
import { useParams } from "react-router";

interface FPControlsProps {
  item: TrackType | TopTrackType | DetailedPlaylistType | ArtistType;
  previewType: "artist" | "playlist" | "track";
  options: string[];
}

function FPControls({ previewType, item, options }: FPControlsProps) {
  const playerState = useStateStore((store) => store.playerState);
  const playTrack = useStateStore((store) => store.playTrack);
  const togglePlayback = useStateStore((store) => store.togglePlayback);
  const deviceId = useStateStore((store) => store.deviceId);
  const { isHovered } = useHoverTrackItem();
  const [areOptionsVisible, setAreOptionsVisible] = useState(false);
  const params = useParams();
  const isCurrentlyPlaying = !playerState?.paused;

  const isCurrentlyPlayingThisPlaylist =
    playerState?.context?.uri?.split(":")[2] === item.id ||
    params.id === item.id;

  const menuRef = useOutsideClick(
    setAreOptionsVisible,
  ) as React.RefObject<HTMLUListElement>;

  const handleDisplayTrackOptions = () => {
    setAreOptionsVisible(true);
  };

  const handlePlayTrack = () => {
    if (deviceId === null) throw new Error("🛑 No deviceId found");
    const uri = `spotify:${previewType}:${item.id}`;

    return isCurrentlyPlayingThisPlaylist
      ? togglePlayback()
      : playTrack(uri, previewType);
  };

  return (
    // ! CONTROLS div
    <div className="flex items-center gap-5">
      {isCurrentlyPlaying ? (
        <IoMdPause
          onClick={togglePlayback}
          size={54}
          fill="black"
          className="cursor-pointer rounded-[50%] bg-green-500 p-4 transition duration-150 hover:brightness-120"
        />
      ) : (
        <IoMdPlay
          onClick={handlePlayTrack}
          size={54}
          fill="black"
          className="cursor-pointer rounded-[50%] bg-green-500 p-4 transition duration-150 hover:brightness-120"
        />
      )}
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

export default memo(FPControls);
