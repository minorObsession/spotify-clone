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

function GlobalContextMenu() {
  const {
    playTrack,
    togglePlayback,
    playerState,
    addToLikedSongs,
    deletePlaylist,
  } = useStateStore();

  const { isVisible, position, contextData, hideContextMenu } = useContextMenu({
    preventDefault: true,
  });

  if (!isVisible) return null;

  const { trackId, playlistId } = contextData;
  const isCurrentlyPlaying = !playerState?.paused;
  const isTrackPlaying =
    playerState?.track_window?.current_track?.id === trackId;

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

  const handleDeletePlaylist = async () => {
    if (playlistId) {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this playlist?",
      );
      if (isConfirmed) {
        await deletePlaylist(playlistId);
      }
    }
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

  const menuItems = [];

  // Track-specific items
  if (trackId) {
    menuItems.push(
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

  // Playlist-specific items
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
        key="edit-playlist"
        className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100"
      >
        <FaEdit size={14} />
        Edit details
      </button>,
      <button
        key="delete-playlist"
        onClick={handleDeletePlaylist}
        className="flex w-full items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-gray-100"
      >
        <FaTrash size={14} />
        Delete
      </button>,
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

  // Default items if no specific context
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
