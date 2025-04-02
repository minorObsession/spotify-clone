import { useLoaderData, useNavigate } from "react-router-dom";
import { useStateStore } from "../../state/store";
import { DetailedPlaylistType } from "./playlists";
import FullPreviewTracks from "../tracks/FullPreviewTracks";
import PlaylistPreviewHeader from "./PlaylistPreviewHeader";
import FullPreviewOverview from "../../components/FullPreviewOverview";
import { createLoader } from "../../state/helpers";

function FullPreviewPlaylist() {
  // ! from url decide the type - playlist, show or album
  // ! type it
  const data = useLoaderData() as DetailedPlaylistType;
  const navigate = useNavigate();

  const rawTracks = (data as unknown as { tracks: any }).tracks;
  const tracksArr = Array.isArray(rawTracks) ? rawTracks : rawTracks.items;

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-scroll bg-amber-800 p-3 md:p-4">
      <button className="self-start" onClick={() => navigate("/home")}>
        &larr;
      </button>
      <FullPreviewOverview data={data} />
      <PlaylistPreviewHeader />
      <FullPreviewTracks tracks={tracksArr} />
    </div>
  );
}

// ! ABSTRACT CREATING LOADED FUNCTIONS!!!

const { getPlaylist } = useStateStore.getState();
export const playlistLoader = createLoader<DetailedPlaylistType>(
  "track",
  getPlaylist,
);

export default FullPreviewPlaylist;
