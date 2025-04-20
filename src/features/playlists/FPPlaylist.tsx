import { useLoaderData } from "react-router-dom";

import { useStateStore } from "../../state/store";
import { DetailedPlaylistType } from "./playlists";
import FPPlaylistTracks from "../tracks/FPPlaylistTracks";
import PlaylistPreviewHeader from "./PlaylistPreviewHeader";

import { createLoader } from "../../state/helpers";
import BackToHomeButton from "../../components/BackToHomeButton";
import FPPlaylistOverview from "./FPPlaylistOverview";
import { useLoadMoreTracksOnScroll } from "../../hooks/useLoadMoreTracksOnScroll";

function FullPreviewPlaylist() {
  const data = useLoaderData() as DetailedPlaylistType;

  const { usersSavedTracks } = useStateStore();
  const { getUserSavedTracks } = useStateStore();

  // const extendedData = {...data, ...usersSavedTracks};

  // * SENTINEL RELATED CODE
  const handleLoadMore = () => {
    if (data.id === "liked_songs") {
      getUserSavedTracks(usersSavedTracks!.numTracks);
    }
  };

  const sentinelRef = useLoadMoreTracksOnScroll(handleLoadMore);

  // * MAYBE A USEEFFECT TO SYNC usersSavedTracks

  return (
    <div className={`fullPreviewContainer gap-3`}>
      <BackToHomeButton />

      <FPPlaylistOverview data={data} />
      <PlaylistPreviewHeader />
      <FPPlaylistTracks tracks={data.tracks} sentinelRef={sentinelRef} />
    </div>
  );
}

const { getPlaylist } = useStateStore.getState();
export const playlistLoader = createLoader<DetailedPlaylistType>(
  "playlist",
  getPlaylist,
);

export default FullPreviewPlaylist;
