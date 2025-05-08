import { useLoaderData } from "react-router-dom";

import { useStateStore } from "../../state/store";
import { DetailedPlaylistType } from "./playlists";
import FPPlaylistTracks from "../tracks/FPPlaylistTracks";
import PlaylistPreviewHeader from "./PlaylistPreviewHeader";

import { createLoader } from "../../state/helpers";
import FPPlaylistOverview from "./FPPlaylistOverview";
import { useLoadMoreTracksOnScroll } from "../../hooks/useLoadMoreTracksOnScroll";
import { memo, useEffect, useRef } from "react";
import FPControls from "../../components/FPControls";
import { playlistOptions } from "../../config/menuOptions";

function FullPreviewPlaylist() {
  const initialPlaylist = useLoaderData() as DetailedPlaylistType;
  const { getPlaylist, setPlaylist, playlist } = useStateStore(
    (store) => store,
  );
  const getUserSavedTracks = useStateStore().getUserSavedTracks;
  const isFetching = useRef(false);
  const hasMoreToLoad = playlist.tracks?.length < (playlist.numTracks || 0);
  // On mount, initialize Zustand with loader data

  useEffect(() => {
    if (initialPlaylist) setPlaylist(initialPlaylist);
  }, [initialPlaylist, setPlaylist]);

  // wrap into useCallback
  const handleLoadMore = async () => {
    if (!hasMoreToLoad) return;
    isFetching.current = true;
    try {
      const loadedTracks =
        playlist.id === "liked_songs"
          ? await getUserSavedTracks(playlist.tracks.length)
          : await getPlaylist(playlist.id, playlist.tracks.length);

      if (loadedTracks) {
        const allTracks = [...playlist.tracks, ...loadedTracks.tracks];
        const uniqueTracks = Array.from(
          new Map(allTracks.map((track) => [track.id, track])).values(),
        );

        setPlaylist({
          ...playlist,
          tracks: uniqueTracks,
        });
      }
    } finally {
      isFetching.current = false;
    }
  };

  const sentinelRef = useLoadMoreTracksOnScroll(handleLoadMore);

  return (
    <div className={`fullPreviewContainer gap-3`}>
      <FPPlaylistOverview
        playlist={playlist}
        // refetchPlaylist={refetchPlaylist}
      />
      <PlaylistPreviewHeader />
      <FPControls
        item={playlist}
        previewType="playlist"
        options={playlistOptions}
      />
      <FPPlaylistTracks tracks={playlist.tracks} sentinelRef={sentinelRef} />
    </div>
  );
}
let playlistLoaderNumRUNS = 0;

const getPlaylist = useStateStore.getState().getPlaylist;
export const playlistLoader = createLoader<DetailedPlaylistType>(
  "playlist",
  async (id: string) => {
    playlistLoaderNumRUNS++;
    console.log("playlistLoaderNumRUNS:", playlistLoaderNumRUNS);

    const playlist = await getPlaylist(id);
    // console.log("playlist", playlist);

    playlist.tracks = playlist.tracks.slice(0, 50);
    useStateStore.getState().setPlaylist(playlist); // Hydrate Zustand
    return playlist;
  },
);

export default memo(FullPreviewPlaylist);
