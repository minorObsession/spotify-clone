import { useLoaderData } from "react-router-dom";

import { useStateStore } from "../../state/store";
import { DetailedPlaylistType } from "./playlists";
import FPPlaylistTracks from "../tracks/FPPlaylistTracks";
import PlaylistPreviewHeader from "./PlaylistPreviewHeader";

import { createLoader } from "../../state/helpers";
import BackToHomeButton from "../../components/BackToHomeButton";
import FPPlaylistOverview from "./FPPlaylistOverview";
import { useLoadMoreTracksOnScroll } from "../../hooks/useLoadMoreTracksOnScroll";
import { memo, useEffect, useRef, useState } from "react";

function FullPreviewPlaylist() {
  const playlist = useLoaderData() as DetailedPlaylistType;

  const [tracks, setTracks] = useState(playlist.tracks);

  const isFetching = useRef(false);
  const { getUserSavedTracks } = useStateStore();
  // const { usersSavedTracks } = useStateStore();

  const hasMoreToLoad = tracks?.length < (playlist.numTracks || 0);

  const handleLoadMore = async () => {
    if (!hasMoreToLoad) return;
    try {
      isFetching.current = true;
      console.log("will start hanldeloadmore...");
      let loadedTracks;
      if (playlist.id === "liked_songs")
        loadedTracks = await getUserSavedTracks(tracks?.length);
      else loadedTracks = await getPlaylist(playlist.id, tracks?.length);

      console.log(loadedTracks);
      if (loadedTracks) {
        setTracks((prevTracks) => {
          const allTracks = [...prevTracks, ...loadedTracks.tracks];

          const uniqueTracksMap = new Map();
          for (const track of allTracks) {
            if (!uniqueTracksMap.has(track.trackId)) {
              uniqueTracksMap.set(track.trackId, track);
            }
          }
          return Array.from(uniqueTracksMap.values());
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      isFetching.current = false;
    }
  };

  useEffect(() => {
    setTracks(playlist.tracks);
  }, [playlist.tracks]);

  const sentinelRef = useLoadMoreTracksOnScroll(handleLoadMore);

  return (
    <div className={`fullPreviewContainer gap-3`}>
      <BackToHomeButton />

      <FPPlaylistOverview playlist={playlist} />
      <PlaylistPreviewHeader />
      <FPPlaylistTracks tracks={tracks} sentinelRef={sentinelRef} />
    </div>
  );
}

const { getPlaylist } = useStateStore.getState();
export const playlistLoader = createLoader<DetailedPlaylistType>(
  "playlist",
  async (id: string) => {
    console.log("playlist loader running....");
    const playlist = await getPlaylist(id);
    console.log(playlist);

    playlist.tracks = playlist.tracks.slice(0, 50);
    return playlist;
  },
);

export default memo(FullPreviewPlaylist);
