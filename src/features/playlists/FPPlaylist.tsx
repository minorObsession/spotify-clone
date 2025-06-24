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
  const { playlist, setPlaylist, getPlaylist, getUserSavedTracks } =
    useStateStore((state) => state);
  const isFetching = useRef(false);
  const hasMoreToLoad = playlist?.tracks?.length < (playlist?.numTracks || 0);
  const currPlaylist = useStateStore((state) =>
    state.playlist?.id === "liked_songs"
      ? (state.usersSavedTracks as DetailedPlaylistType)
      : state.playlist,
  );
  // On mount, initialize Zustand with loader data
  useEffect(() => {
    if (initialPlaylist) setPlaylist(initialPlaylist);
  }, [initialPlaylist, setPlaylist]);

  // wrap into useCallback
  const handleLoadMore = async () => {
    console.log("calling HLM");
    if (!hasMoreToLoad || !playlist) return;
    isFetching.current = true;
    try {
      if (playlist.id === "liked_songs") {
        const loadedTracks = await getUserSavedTracks(playlist.tracks.length);
        if (!loadedTracks.success) return;
        const allTracks = [...playlist.tracks, ...loadedTracks.data.tracks];
        const uniqueTracks = Array.from(
          new Map(allTracks.map((track) => [track.id, track])).values(),
        );

        setPlaylist({
          ...playlist,
          tracks: uniqueTracks,
        });
      } else {
        const result = await getPlaylist(playlist.id, playlist.tracks.length);
        if (result.success && result.data) {
          const allTracks = [...playlist.tracks, ...result.data.tracks];
          const uniqueTracks = Array.from(
            new Map(allTracks.map((track) => [track.id, track])).values(),
          );

          setPlaylist({
            ...playlist,
            tracks: uniqueTracks,
          });
        }
      }
    } finally {
      isFetching.current = false;
    }
  };

  const sentinelRef = useLoadMoreTracksOnScroll(handleLoadMore);

  if (!playlist) return null;

  return (
    <div className={`fullPreviewContainer gap-3`}>
      <FPPlaylistOverview playlist={playlist} />
      <PlaylistPreviewHeader />
      <FPControls
        item={playlist}
        previewType="playlist"
        options={playlistOptions}
      />
      <FPPlaylistTracks
        tracks={currPlaylist?.tracks || []}
        sentinelRef={sentinelRef}
      />
    </div>
  );
}

export const playlistLoader = createLoader<DetailedPlaylistType>(
  "playlist",
  async (id) => {
    const { getPlaylist } = useStateStore.getState();

    if (!id) throw new Error("No playlist ID provided");

    const result = await getPlaylist(id);

    if (!result.success)
      throw new Error(result.error?.message || "Failed to load playlist");

    return result.data;
  },
);

export default memo(FullPreviewPlaylist);
