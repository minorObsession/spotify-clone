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
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../features/auth/authHelpers";

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
  const playlistNames = playlists?.map((playlist) => playlist.name) || [];

  const playlistMenuRef = useOutsideClick<HTMLUListElement>(
    () => setIsPlaylistSelectMenuOpen(false),
    undefined,
    true,
  ) as React.RefObject<HTMLUListElement>;

  const handleAddToLikedSongs = () => {
    // * optimistic update UI
    let usersSavedTracksVar: DetailedPlaylistType;

    // local store update
    useStateStore.setState((prevState) => {
      if (!prevState.usersSavedTracks) return prevState;
      const newState = {
        ...prevState,
        usersSavedTracks: {
          ...prevState.usersSavedTracks,
          tracks: [track, ...prevState.usersSavedTracks.tracks],
        },
      };
      usersSavedTracksVar = newState.usersSavedTracks;
      return newState;
    });

    // * update local storage
    localStorage.setItem(
      `${useStateStore.getState().user?.username}s_saved_tracks_with_offset_of_0`,
      JSON.stringify(usersSavedTracksVar!),
    );

    console.log("should be all updated");
    // * call spotify api with post req
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${useStateStore.getState().accessToken?.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: [`spotify:track:${track.id}`],
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add track to playlist");
      }

      // Update local storage
      const playlist = getFromLocalStorage(`playlist${playlistId}`);
      if (playlist) {
        const updatedPlaylist = {
          ...playlist,
          tracks: {
            ...playlist.tracks,
            items: [...playlist.tracks.items, { track }],
          },
        };
        saveToLocalStorage(`playlist${playlistId}`, updatedPlaylist);
      }

      // * optimistic update UI
    } catch (error) {
      console.error("Error adding track to playlist:", error);
    }
  };

  // ! look for this ID in all playlists - make function that does this
  const isTheTrackInLibrary = isTrackInLibrary(id);
  const tooltipMessage = isTheTrackInLibrary
    ? "Add to Playlist"
    : "Add to Liked Songs";

  return (
    // ! container
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) =>
        isTheTrackInLibrary ? handleAddToPlaylist(id) : handleAddToLikedSongs()
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
        menuFor="addToPlaylist"
        options={playlistNames}
      />
    </div>
  );
}

export default AddToPlaylist;
