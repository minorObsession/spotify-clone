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
import { useParams, useNavigate } from "react-router";
import { AlbumType } from "../features/albums/album";
import { PodcastType } from "../features/podcasts/podcast";

interface FPControlsProps {
  item:
    | TrackType
    | TopTrackType
    | DetailedPlaylistType
    | ArtistType
    | AlbumType
    | PodcastType;
  previewType: "artist" | "playlist" | "track" | "album" | "podcast";
  options: string[];
}

function FPControls({ previewType, item, options }: FPControlsProps) {
  const playerState = useStateStore((store) => store.playerState);
  const playTrack = useStateStore((store) => store.playTrack);
  const togglePlayback = useStateStore((store) => store.togglePlayback);
  const deviceId = useStateStore((store) => store.deviceId);
  const deletePlaylist = useStateStore((store) => store.deletePlaylist);
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverTrackItem();
  const [areOptionsVisible, setAreOptionsVisible] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const isCurrentlyPlaying = !playerState?.paused;

  const isCurrentlyPlayingThisPlaylist =
    playerState?.context?.uri?.split(":")[2] === item.id ||
    params.id === item.id;

  const menuRef = useOutsideClick<HTMLUListElement>(
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
    <div className="relative flex w-fit items-center gap-5">
      {isCurrentlyPlaying ? (
        <IoMdPause
          onClick={togglePlayback}
          size={54}
          fill="black"
          className="green-play-pause-button"
        />
      ) : (
        // * not currently playing
        <IoMdPlay
          onClick={handlePlayTrack}
          size={54}
          fill="black"
          className="green-play-pause-button"
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
        directionOfMenu="topLeft"
        addClassName={`-right-48 transform -translate-y-3`}
      />
      {/* // ! dots */}
      <SlOptions
        onClick={handleDisplayTrackOptions}
        size={24}
        fill="grey"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-pointer transition duration-200 hover:scale-105 hover:brightness-120"
      />
      {/* // ! menu    */}
      {previewType === "playlist" ||
      previewType === "artist" ||
      previewType === "album" ? (
        // Simple options menu for playlists, artists, and albums
        <ul
          ref={menuRef}
          className={`absolute -right-4 bottom-2 z-10 max-h-80 overflow-y-auto rounded-md bg-amber-200 p-1 text-sm text-nowrap shadow-md ${areOptionsVisible ? "inline" : "hidden"}`}
        >
          {options.map((option) => (
            <li
              key={option}
              className="z-1000 flex h-10 w-full items-center rounded-md p-2 font-bold hover:cursor-pointer hover:bg-amber-400"
              onClick={() => {
                if (option === "Delete") {
                  // Handle delete playlist
                  const isConfirmed = window.confirm(
                    `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
                  );

                  if (isConfirmed) {
                    deletePlaylist(item.id).then((result) => {
                      if (result.success) {
                        console.log("✅ Playlist deleted successfully");
                        navigate("/home");
                      } else {
                        console.error(
                          "❌ Failed to delete playlist:",
                          result.error,
                        );
                      }
                    });
                  }
                } else if (option === "Edit details") {
                  // Handle edit details
                  console.log("Edit playlist details:", item.id);
                } else {
                  console.log("Option clicked:", option);
                }
                setAreOptionsVisible(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      ) : (
        <OptionsMenu
          menuFor={previewType}
          ref={menuRef}
          areOptionsVisible={areOptionsVisible}
          setAreOptionsVisible={setAreOptionsVisible}
          options={options}
          directionOfMenu="bottomLeft"
        />
      )}
    </div>
  );
}

export default memo(FPControls);
