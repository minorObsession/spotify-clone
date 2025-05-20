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

// * put this back into the componnet

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
  const handleAddToLikedSongs = (
    e: React.MouseEvent<HTMLDivElement>,
    id: string,
  ) => {
    // * optimistic update UI
    // for testing
    const testTrack = {
      name: ` ${Math.random()} GANCI (Radio Edit)`,
      id: Math.random().toString(),
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b27323933555145a05249a9e8042",
      multipleArtists: false,
      artists: [
        {
          name: "Remusic",
          artistId: "6fm0ZVpyhf6bQZltcDl8yu",
        },
      ],
      type: "track",
      trackDuration: 276917,
      releaseDate: "2024-07-12",
      albumName: "Roma",
      albumId: "5xmCzFYRqTRVjym8GbLinh",
    };

    let usersSavedTracksVar: DetailedPlaylistType;

    // local store update
    useStateStore.setState((prevState) => {
      if (!prevState.usersSavedTracks) return prevState;
      const newState = {
        ...prevState,
        usersSavedTracks: {
          ...prevState.usersSavedTracks,
          tracks: [testTrack, ...prevState.usersSavedTracks.tracks],
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

  const handleAddToPlaylist = (
    e: React.MouseEvent<HTMLDivElement>,
    id: string,
  ) => {
    e.stopPropagation();
    // * open options menu
    if (isPlaylistSelectMenuOpen) setIsPlaylistSelectMenuOpen(false);

    setTimeout(() => setIsPlaylistSelectMenuOpen(true), 0);
    // * get all users playlists
    //
    // * call spotify api with post req
    // * optimistic update UI
  };

  // ! look for this ID in all playlists - make function that does this

  const isTheTrackInLibrary = isTrackInLibrary(id);
  // console.log(isTheTrackInLibrary);
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
