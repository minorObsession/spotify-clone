import { MenuFor } from "./OptionsMenu";
import { useStateStore } from "../state/store";
import { memo, useCallback } from "react";

interface OptionItemProps {
  option: string;
  menuFor: MenuFor;
  selectedTrackId: string;
}

interface PlaylistNamesWithSelectedTrack {
  playlistName: string;
  isTrackInPlaylist: boolean;
}

function OptionItem({ option, menuFor, selectedTrackId }: OptionItemProps) {
  const {
    logout,
    playlistNamesWithIds,
    playlists,
    setPlaylistNamesWithIds,
    setUserPlaylists,
  } = useStateStore((store) => store);
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
    try {
      const { addTrackToPlaylist } = useStateStore.getState();

      const playlist = playlists.find((p) => p.name === option);
      const playlistId = playlist?.id;

      if (!playlistId) throw Error("No playlist found");

      // ! check if track is already in playlist
      if (trackInQuestion?.isTrackInPlaylist) {
        // ! add toast notification
        console.log("track already in playlist");
        return;
      }

      const result = await addTrackToPlaylist(playlistId, selectedTrackId);

      if (!result.success) throw Error("Failed to add track to playlist");

      // ! update user playlists
      const updatedUserPlaylists = playlists.map((p) =>
        p.name.toLowerCase() === option.toLowerCase()
          ? { ...p, trackIds: [...p.trackIds, selectedTrackId] }
          : p,
      );

      // ! update playlistNamesWithIds
      const updatedPlaylistNamesWithIds = playlistNamesWithIds.map((p) =>
        p.name === option ? { ...p, ids: [...p.ids, selectedTrackId] } : p,
      );

      setPlaylistNamesWithIds(updatedPlaylistNamesWithIds);
      setUserPlaylists(updatedUserPlaylists);
    } catch (error) {
      console.error("Error adding track to playlist:", error);
    }
  }, [
    playlistNamesWithIds,
    selectedTrackId,
    option,
    trackInQuestion,
    playlists,
    setPlaylistNamesWithIds,
    setUserPlaylists,
  ]);

  const removeTrackFromPlaylist = useCallback(async () => {
    try {
      const { removeTrackFromPlaylist } = useStateStore.getState();

      const playlist = playlists.find((p) => p.name === option);
      const playlistId = playlist?.id;

      if (!playlistId) throw Error("No playlist found");

      const result = await removeTrackFromPlaylist(playlistId, selectedTrackId);

      if (!result.success) throw Error("Failed to remove track from playlist");

      // ! update playlistNamesWithIds
      const updatedPlaylistNamesWithIds = playlistNamesWithIds.map((p) =>
        p.name === option
          ? { ...p, ids: p.ids.filter((id) => id !== selectedTrackId) }
          : p,
      );

      // ! update user playlists
      const updatedUserPlaylists = playlists.map((p) =>
        p.name.toLowerCase() === option.toLowerCase()
          ? {
              ...p,
              trackIds: p.trackIds.filter((id) => id !== selectedTrackId),
            }
          : p,
      );

      setUserPlaylists(updatedUserPlaylists);
      setPlaylistNamesWithIds(updatedPlaylistNamesWithIds);

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
  }, [
    playlistNamesWithIds,
    selectedTrackId,
    option,
    playlists,
    setPlaylistNamesWithIds,
    setUserPlaylists,
    currentPlaylistId,
  ]);

  const handleOptionClick = (
    e: React.MouseEvent<HTMLLIElement>,
    clickedOption: string,
  ) => {
    if (menuFor === "userAvatar") logout();

    if (menuFor === "playlist") {
      if (clickedOption === "Edit details") {
        // ! open modal
      }
    }

    if (menuFor === "addToPlaylist") {
      handleAddToPlaylist();

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
    <div className="flex h-6 w-full items-center justify-between bg-amber-600">
      <li
        onClick={(e) => handleOptionClick(e, option)}
        key={option}
        className={`hover:cursor-pointer hover:underline`}
      >
        {option}
      </li>
      <button
        className="h-4 w-4"
        onClick={() =>
          trackInQuestion?.isTrackInPlaylist
            ? removeTrackFromPlaylist()
            : handleAddToPlaylist()
        }
      >
        {trackInQuestion?.isTrackInPlaylist ? "✅" : "❌"}
      </button>
    </div>
  );
}

export default memo(OptionItem);
