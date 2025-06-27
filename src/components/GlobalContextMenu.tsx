import { RiArrowRightSFill } from "react-icons/ri";
import { RiPlayListAddFill } from "react-icons/ri";

import { useStateStore } from "../state/store";
import { createPortal } from "react-dom";
import {
  FaPlay,
  FaPause,
  FaPlus,
  FaHeart,
  FaShare,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { useContextMenu } from "../hooks/useContextMenu";
import { useState } from "react";
import Tooltip from "./Tooltip";
import OptionsMenu from "./OptionsMenu";
import useOutsideClick from "../hooks/useOutsideClick";

function GlobalContextMenu() {
  const { playTrack, togglePlayback, playerState, addToLikedSongs } =
    useStateStore();
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  const [isPlaylistSelectMenuOpen, setIsPlaylistSelectMenuOpen] =
    useState(false);
  const { isVisible, position, contextData, hideContextMenu } = useContextMenu({
    preventDefault: true,
  });

  const trackId = contextData?.trackId;
  const playlistId = contextData?.playlistId;

  const isCurrentlyPlaying = !playerState?.paused;
  const isTrackPlaying =
    playerState?.track_window?.current_track?.id === trackId;

  const playlists = useStateStore.getState().playlists;
  const playlistNames = playlists?.map((playlist) => playlist.name) || [];

  const handlePlayPause = () => {
    if (trackId) {
      if (isTrackPlaying) {
        togglePlayback();
      } else {
        playTrack(`spotify:track:${trackId}`, "track");
      }
    }
    hideContextMenu();
  };

  const handleAddToLikedSongs = async () => {
    if (trackId) {
      await addToLikedSongs(trackId);
    }
    hideContextMenu();
  };

  const handleAddToPlaylist = () => {
    hideContextMenu();
  };

  const handleShare = () => {
    if (trackId) {
      navigator.clipboard.writeText(
        `https://open.spotify.com/track/${trackId}`,
      );
    } else if (playlistId) {
      navigator.clipboard.writeText(
        `https://open.spotify.com/playlist/${playlistId}`,
      );
    }
    hideContextMenu();
  };

  const menuStyle = {
    position: "fixed" as const,
    left: position.x,
    top: position.y,
    zIndex: 1000,
  };

  const playlistMenuRef = useOutsideClick<HTMLUListElement>(
    setIsPlaylistSelectMenuOpen,
  ) as React.RefObject<HTMLUListElement>;

  const menuItems = [];

  // ! Track-specific items
  if (trackId) {
    menuItems.push(
      <div
        className={`relative flex w-full hover:cursor-pointer`}
        onMouseEnter={() => setIsPlaylistSelectMenuOpen(true)}
        onMouseLeave={() => setIsPlaylistSelectMenuOpen(false)}
      >
        <button
          key="add-to-playlist"
          className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100"
        >
          <FaPlus size={14} />
          <span className="justify-self-start">Add to playlist</span>
          <RiArrowRightSFill size={20} className="grow-1 justify-self-end" />
        </button>

        {/* // ! FIGURING OUT HOW TO PASS WHOLE TRACK OBJECT to the context menu!! */}
        {/* // ! FIGURING OUT HOW TO PASS WHOLE TRACK OBJECT to the context menu!! */}
        {/* // ! FIGURING OUT HOW TO PASS WHOLE TRACK OBJECT to the context menu!! */}
        {/* // ! FIGURING OUT HOW TO PASS WHOLE TRACK OBJECT to the context menu!! */}
        {/* // ! FIGURING OUT HOW TO PASS WHOLE TRACK OBJECT to the context menu!! */}
        {/* // ! FIGURING OUT HOW TO PASS WHOLE TRACK OBJECT!! */}
        {/* // ! FIGURING OUT HOW TO PASS WHOLE TRACK OBJECT!! */}
        <OptionsMenu
          ref={playlistMenuRef}
          areOptionsVisible={isPlaylistSelectMenuOpen}
          setAreOptionsVisible={setIsPlaylistSelectMenuOpen}
          menuFor="addToPlaylist"
          options={playlistNames}
          directionOfMenu="bottomLeft"
          // track ={trackId}
        />
      </div>,
      <button
        key="play-pause"
        onClick={handlePlayPause}
        className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100"
      >
        {isTrackPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
        {isTrackPlaying ? "Pause" : "Play"}
      </button>,
      <button
        key="add-to-liked"
        onClick={handleAddToLikedSongs}
        className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100"
      >
        <FaHeart size={14} />
        Save to your Liked Songs
      </button>,
      <button
        key="add-to-playlist"
        className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100"
      >
        <FaPlus size={14} />
        Add to playlist
      </button>,
      <button
        key="share"
        onClick={handleShare}
        className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100"
      >
        <FaShare size={14} />
        Share
      </button>,
    );
  }

  // ! Playlist-specific items
  if (playlistId) {
    menuItems.push(
      <button
        key="play-playlist"
        onClick={handlePlayPause}
        className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100"
      >
        <FaPlay size={14} />
        Play
      </button>,
      <button
        key="add-to-queue"
        // onClick={handleAddToQueue}
        className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100"
      >
        <RiPlayListAddFill size={14} />
        Add To Queue
      </button>,
      <button
        key="edit-playlist"
        className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100"
      >
        <FaEdit size={14} />
        Edit details
      </button>,
      <div className="relative">
        <button
          key="delete-playlist"
          className={`flex w-full items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-gray-100`}
          onMouseEnter={() => setIsDeleteHovered(true)}
          onMouseLeave={() => setIsDeleteHovered(false)}
        >
          <FaTrash size={14} />
          Delete playlist
        </button>
        <Tooltip
          message="A playlist can only be deleted on the Spotify website or Spotify app"
          isVisible={isDeleteHovered}
          addClassName="translate-x-[75%]"
        />
      </div>,

      <button
        key="share-playlist"
        onClick={handleShare}
        className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100"
      >
        <FaShare size={14} />
        Share
      </button>,
    );
  }

  // ! Default items if no specific context
  if (!trackId && !playlistId) {
    menuItems.push(
      <button
        key="play-pause-global"
        onClick={handlePlayPause}
        className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100"
        disabled={!isCurrentlyPlaying}
      >
        {isCurrentlyPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
        {isCurrentlyPlaying ? "Pause" : "Play"}
      </button>,
    );
  }

  if (!isVisible) return null;

  return createPortal(
    <div
      id="global-context-menu"
      style={menuStyle}
      className="min-w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
    >
      {menuItems}
    </div>,
    document.body,
  );
}

export default GlobalContextMenu;
