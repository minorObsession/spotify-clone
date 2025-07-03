import { FaCircleCheck } from "react-icons/fa6";
import useHoverTrackItem from "../hooks/useHoverTrackItem";
import Tooltip from "./Tooltip";
import { BiPlusCircle } from "react-icons/bi";
import { isTrackInLibrary } from "../features/playlists/playlistHelpers";
import { useState } from "react";
import { useStateStore } from "../state/store";
import OptionsMenu from "./OptionsMenu";
import useOutsideClick from "../hooks/useOutsideClick";
import { TrackType } from "../features/tracks/track";

interface AddToPlaylistProps {
  track: TrackType;
  id: string;
  isTrackHovered: boolean;
  isTrackBoxSelected: boolean;
}

function AddToPlaylist({
  track,
  id,
  isTrackHovered,
  isTrackBoxSelected,
}: AddToPlaylistProps) {
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverTrackItem();
  const [isPlaylistSelectMenuOpen, setIsPlaylistSelectMenuOpen] =
    useState(false);

  const { playlists } = useStateStore.getState();
  const playlistNames = playlists?.map((playlist) => playlist.name) || [];

  const playlistMenuRef = useOutsideClick<HTMLUListElement>(
    setIsPlaylistSelectMenuOpen,
  ) as React.RefObject<HTMLUListElement>;

  const handleAddToLikedSongs = async () => {
    try {
      const { addToLikedSongs } = useStateStore.getState();
      const result = await addToLikedSongs(track.id);
      if (!result.success) throw Error("Failed to add track to liked songs");

      // local store update
    } catch (error) {
      console.error("Error adding track to liked songs:", error);
    }

    useStateStore.setState((prevState) => {
      if (!prevState.usersSavedTracks) return prevState;
      const newState = {
        ...prevState,
        usersSavedTracks: {
          ...prevState.usersSavedTracks,
          tracks: [track, ...prevState.usersSavedTracks.tracks],
        },
      };

      return newState;
    });

    console.log("should be all updated");
    // * call spotify api with post req
  };

  const isTheTrackInLibrary = isTrackInLibrary(id);
  const tooltipMessage = isTheTrackInLibrary
    ? "Add to Playlist"
    : "Add to Liked Songs";

  return (
    // ! container
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() =>
        isTheTrackInLibrary
          ? setIsPlaylistSelectMenuOpen(true)
          : handleAddToLikedSongs()
      }
      className="relative flex"
    >
      {/* //!  Tooltip */}
      <Tooltip
        message={tooltipMessage}
        isVisible={isHovered && !isPlaylistSelectMenuOpen}
      />

      <button className="cursor-pointer">
        {isTheTrackInLibrary ? (
          <FaCircleCheck fill="green" />
        ) : isTrackBoxSelected || isTrackHovered ? (
          <BiPlusCircle />
        ) : (
          <span className={`${isTrackBoxSelected ? "visible" : "invisible"}`}>
            <BiPlusCircle />
          </span>
        )}
      </button>

      <OptionsMenu
        ref={playlistMenuRef}
        areOptionsVisible={isPlaylistSelectMenuOpen}
        setAreOptionsVisible={setIsPlaylistSelectMenuOpen}
        menuFor="addToPlaylist"
        options={playlistNames}
        track={track}
      />
    </div>
  );
}

export default AddToPlaylist;
