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
import { DetailedPlaylistType } from "../features/playlists/playlists";

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

  const playlists = useStateStore.getState().playlists;
  const playlistNames = playlists.map((playlist) => playlist.name);

  const playlistMenuRef = useOutsideClick<HTMLUListElement>(
    () => setIsPlaylistSelectMenuOpen(false),
    undefined,
    true,
  ) as React.RefObject<HTMLUListElement>;

  const handleAddToPlaylist = (
    e: React.MouseEvent<HTMLDivElement>,
    id: string,
  ) => {
    e.stopPropagation();
    // * open options menu
    // if (isPlaylistSelectMenuOpen) setIsPlaylistSelectMenuOpen(false);

    setTimeout(() => setIsPlaylistSelectMenuOpen(true), 0);
    // * get all users playlists
    //
    // * call spotify api with post req
    // * optimistic update UI
  };

  const handleAddToLikedSongs = (
    e: React.MouseEvent<HTMLDivElement>,
    id: string,
  ) => {
    // * optimistic update UI

    const usersSavedTracks = useStateStore.getState()
      .usersSavedTracks as DetailedPlaylistType;

    if (!usersSavedTracks || usersSavedTracks === null) return;

    useStateStore.setState({
      usersSavedTracks: {
        ...usersSavedTracks,
        tracks: [track, ...usersSavedTracks.tracks],
      },
    });
    console.log(useStateStore.getState().user);
    // * update local storage
    localStorage.setItem(
      `${useStateStore.getState().user?.username}s_saved_tracks`,
      JSON.stringify(usersSavedTracks),
    );

    console.log("should be updated");
    // * call spotify api with post req
  };

  // ! look for this ID in all playlists - make function that does this

  const isTheTrackInLibrary = isTrackInLibrary(id);

  return (
    // ! container
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) =>
        isTheTrackInLibrary
          ? handleAddToPlaylist(e, id)
          : handleAddToLikedSongs(e, id)
      }
      className="relative flex"
    >
      {/* //!  Tooltip */}
      <Tooltip
        message={`${isTheTrackInLibrary ? "Add to Playlist" : "Add to Liked Songs"}`}
        isVisible={isHovered && !isPlaylistSelectMenuOpen}
      />

      <button className="cursor-pointer">
        {isTheTrackInLibrary ? (
          <FaCircleCheck fill="green" />
        ) : isTrackBoxSelected || isTrackHovered ? (
          <BiPlusCircle />
        ) : (
          <span className="invisible">
            <BiPlusCircle />
          </span>
        )}
      </button>
      <OptionsMenu
        ref={playlistMenuRef}
        areOptionsVisible={isPlaylistSelectMenuOpen}
        menuFor="addToPlaylist"
        options={playlistNames}
      />
    </div>
  );
}

export default AddToPlaylist;
