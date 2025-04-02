import { useLoaderData } from "react-router-dom";

import { useStateStore } from "../../state/store";
import { DetailedPlaylistType } from "./playlists";
import FullPreviewTracks from "../tracks/FullPreviewTracks";
import PlaylistPreviewHeader from "./PlaylistPreviewHeader";
import FullPreviewPlaylistOverview from "../../components/FullPreviewPlaylistOverview";
import { createLoader } from "../../state/helpers";
import BackToHomeButton from "../../components/BackToHomeButton";

function FullPreviewPlaylist() {
  const data = useLoaderData() as DetailedPlaylistType;

  const rawTracks = (data as unknown as { tracks: any }).tracks;
  const tracksArr = Array.isArray(rawTracks) ? rawTracks : rawTracks.items;

  return (
    <div className={`fullPreviewContainer`}>
      <BackToHomeButton />

      <FullPreviewPlaylistOverview data={data} />
      <PlaylistPreviewHeader />
      <FullPreviewTracks tracks={tracksArr} />
    </div>
  );
}

const { getPlaylist } = useStateStore.getState();
export const playlistLoader = createLoader<DetailedPlaylistType>(
  "track",
  getPlaylist,
);

export default FullPreviewPlaylist;
