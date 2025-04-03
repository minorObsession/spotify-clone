import { useLoaderData } from "react-router-dom";

import { useStateStore } from "../../state/store";
import { DetailedPlaylistType } from "./playlists";
import FPPlaylistTracks from "../tracks/FPPlaylistTracks";
import PlaylistPreviewHeader from "./PlaylistPreviewHeader";

import { createLoader } from "../../state/helpers";
import BackToHomeButton from "../../components/BackToHomeButton";
import FPPlaylistOverview from "./FPPlaylistOverview";
// import { TrackType } from "../tracks/track";

function FullPreviewPlaylist() {
  const data = useLoaderData() as DetailedPlaylistType;

  // console.log(data);
  // const rawTracks = (data as unknown as { tracks: TrackType[] }).tracks;
  // // const tracksArr = Array.isArray(rawTracks) ? rawTracks : rawTracks.items;

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
  "track",
  getPlaylist,
);

export default FullPreviewPlaylist;
