import { useLoaderData } from "react-router-dom";

import { useStateStore } from "../../state/store";
import { DetailedPlaylistType } from "./playlists";
import FPPlaylistTracks from "../tracks/FPPlaylistTracks";
import PlaylistPreviewHeader from "./PlaylistPreviewHeader";

import { createLoader } from "../../state/helpers";
import BackToHomeButton from "../../components/BackToHomeButton";
import FPPlaylistOverview from "./FPPlaylistOverview";

function FullPreviewPlaylist() {
  const data = useLoaderData() as DetailedPlaylistType;

  return (
    <div className={`fullPreviewContainer gap-3`}>
      <BackToHomeButton />

      <FPPlaylistOverview data={data} />
      <PlaylistPreviewHeader />
      <FPPlaylistTracks tracks={data.tracks} />
    </div>
  );
}

const { getPlaylist } = useStateStore.getState();
export const playlistLoader = createLoader<DetailedPlaylistType>(
  "playlist",
  getPlaylist,
);

export default FullPreviewPlaylist;
