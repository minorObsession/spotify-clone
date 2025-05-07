import { useLoaderData } from "react-router-dom";

import { useStateStore } from "../../state/store";
import { DetailedPlaylistType } from "./playlists";
import FPPlaylistTracks from "../tracks/FPPlaylistTracks";
import PlaylistPreviewHeader from "./PlaylistPreviewHeader";

import { createLoader } from "../../state/helpers";
import FPPlaylistOverview from "./FPPlaylistOverview";
import { useLoadMoreTracksOnScroll } from "../../hooks/useLoadMoreTracksOnScroll";
import { memo, useRef } from "react";
import FPControls from "../../components/FPControls";
import { playlistOptions } from "../../config/menuOptions";
import { useReactivePlaylist } from "../../hooks/useReactivePlaylist";

function FullPreviewPlaylist() {
  const initialPlaylist = useLoaderData() as DetailedPlaylistType;
  const { updatedPlaylist, setUpdatedPlaylist, refreshPlaylist } =
    useReactivePlaylist(initialPlaylist);
  const { getUserSavedTracks } = useStateStore();
  const isFetching = useRef(false);
  const hasMoreToLoad =
    updatedPlaylist.tracks?.length < (updatedPlaylist.numTracks || 0);

  // wrap into useCallback
  const handleLoadMore = async () => {
    if (!hasMoreToLoad) return;
    isFetching.current = true;
    try {
      const loadedTracks =
        updatedPlaylist.id === "liked_songs"
          ? await getUserSavedTracks(updatedPlaylist.tracks.length)
          : await getPlaylist(
              updatedPlaylist.id,
              updatedPlaylist.tracks.length,
            );

      if (loadedTracks) {
        setUpdatedPlaylist((prev) => {
          const allTracks = [...prev.tracks, ...loadedTracks.tracks];
          const uniqueTracks = Array.from(
            new Map(allTracks.map((track) => [track.id, track])).values(),
          );

          return {
            ...prev,
            tracks: uniqueTracks,
          };
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
        playlist={updatedPlaylist}
        refreshPlaylist={refreshPlaylist}
      />
      <PlaylistPreviewHeader />
      <FPControls
        item={updatedPlaylist}
        previewType="playlist"
        options={playlistOptions}
      />
      <FPPlaylistTracks
        tracks={updatedPlaylist.tracks}
        sentinelRef={sentinelRef}
      />
    </div>
  );
}

const { getPlaylist } = useStateStore.getState();
export const playlistLoader = createLoader<DetailedPlaylistType>(
  "playlist",
  async (id: string) => {
    const playlist = await getPlaylist(id);

    playlist.tracks = playlist.tracks.slice(0, 50);
    return playlist;
  },
);

export default memo(FullPreviewPlaylist);
