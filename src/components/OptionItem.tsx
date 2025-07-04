import { FaCircleCheck, FaRegCircle } from "react-icons/fa6";
import { MenuFor } from "./OptionsMenu";
import { useStateStore } from "../state/store";
import { memo, useCallback } from "react";
import { useNavigate } from "react-router";

interface OptionItemProps {
  option: string;
  menuFor: MenuFor;
  selectedTrackId: string;
  onOptionClick?: (option: string) => void;
}

interface PlaylistNamesWithSelectedTrack {
  playlistName: string;
  isTrackInPlaylist: boolean;
}

function OptionItem({
  option,
  menuFor,
  selectedTrackId,
  onOptionClick,
}: OptionItemProps) {
  const navigate = useNavigate();
  const { logout, playlistNamesWithIds, playlists, deletePlaylist } =
    useStateStore((store) => store);
  // for each option (playlist), determine if selected track is in playlist
  const currentPlaylistId = location.pathname.split("/playlist/")[1];
  const playlistNamesWithSelectedTrack: PlaylistNamesWithSelectedTrack[] =
    playlistNamesWithIds.map((p) => ({
      playlistName: p.name,
      isTrackInPlaylist: p.ids.includes(selectedTrackId),
    }));

  const trackInQuestion = playlistNamesWithSelectedTrack.find(
    (p) => p.playlistName === option,
  );

  const handleAddToPlaylist = useCallback(async () => {
    // console.log(trackInQuestion);
    try {
      const { addTrackToPlaylist } = useStateStore.getState();

      const playlist = playlists.find((p) => p.name === option);
      const playlistId = playlist?.id;

      console.log("playlistId", playlistId);
      if (!playlistId) throw Error("No playlist found!");

      // ! check if track is already in playlist
      if (trackInQuestion?.isTrackInPlaylist) {
        // ! add toast notification
        console.log("track already in playlist");
        return;
      }

      const result = await addTrackToPlaylist(playlistId, selectedTrackId);

      if (!result.success) throw Error("Failed to add track to playlist");
    } catch (error) {
      console.error("Error adding track to playlist:", error);
    }
  }, [selectedTrackId, option, trackInQuestion, playlists]);

  const removeTrackFromPlaylist = useCallback(async () => {
    // console.log(trackInQuestion);

    try {
      const { removeTrackFromPlaylist } = useStateStore.getState();

      const playlist = playlists.find((p) => p.name === option);
      const playlistId = playlist?.id;

      if (!playlistId) throw Error("No playlist found");

      const result = await removeTrackFromPlaylist(playlistId, selectedTrackId);

      if (!result.success) throw Error("Failed to remove track from playlist");

      // if current playlist is modified, update UI
      if (playlistId === currentPlaylistId) {
        console.log("CURR PLAYLIST");
        useStateStore.setState((state) => ({
          ...state,
          playlist: {
            ...state.playlist,
            tracks: state.playlist.tracks.filter(
              (t) => t.id !== selectedTrackId,
            ),
          },
        }));
      }
    } catch (error) {
      console.error("Error removing track from playlist:", error);
    }
  }, [selectedTrackId, option, playlists, currentPlaylistId]);

  const handleDeletePlaylist = useCallback(async () => {
    // Add confirmation dialog
    const isConfirmed = window.confirm(
      `Are you sure you want to delete "${option}"? This action cannot be undone.`,
    );

    if (!isConfirmed) return;

    try {
      const playlist = playlists.find((p) => p.name === option);
      const playlistId = playlist?.id;

      if (!playlistId) throw Error("No playlist found");

      const result = await deletePlaylist(playlistId);

      if (!result.success) throw Error("Failed to delete playlist");

      console.log("✅ Playlist deleted successfully");
      // TODO: Show success toast/notification
      navigate("/home");
    } catch (error) {
      console.error("Error deleting playlist:", error);
      // TODO: Show error toast/notification
    }
  }, [option, playlists, deletePlaylist, navigate]);

  const handleOptionClick = (
    e: React.MouseEvent<HTMLElement>,
    clickedOption: string,
  ) => {
    console.log("clickedOption", clickedOption);
    // If external callback is provided, use it
    if (onOptionClick) {
      onOptionClick(clickedOption);
      return;
    }

    // Otherwise, use internal logic
    if (menuFor === "userAvatar") logout();

    if (menuFor === "playlist") {
      if (clickedOption === "Edit details") {
        // ! open modal
      }
      if (clickedOption === "Delete") {
        handleDeletePlaylist();
      }
    }

    if (menuFor === "addToPlaylist") {
      if (trackInQuestion?.isTrackInPlaylist) {
        removeTrackFromPlaylist();
      } else {
        handleAddToPlaylist();
      }

      if (clickedOption === "Edit details") {
        // ! open modal
      }
    }

    if (menuFor === "track") {
      if (clickedOption === "Add to playlist") {
        // ! open modal
      }
    }
  };

  return (
    <div
      onClick={(e) => handleOptionClick(e, option)}
      className="z-1000 flex h-10 w-full items-center justify-between rounded-md p-2 font-bold hover:cursor-pointer hover:bg-amber-400"
    >
      <li key={option}>{option}</li>
      {menuFor === "addToPlaylist" && (
        <button className="h-4 w-4 hover:cursor-pointer">
          {trackInQuestion?.isTrackInPlaylist ? (
            <FaCircleCheck fill="green" />
          ) : (
            <FaRegCircle fill="black" />
          )}
        </button>
      )}
    </div>
  );
}

export default memo(OptionItem);
