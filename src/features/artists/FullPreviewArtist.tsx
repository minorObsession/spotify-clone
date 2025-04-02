import { useLoaderData, useNavigate } from "react-router-dom";
import { useStateStore } from "../../state/store";

import { ArtistType } from "./artist";
import PlaylistPreviewHeader from "../playlists/PlaylistPreviewHeader";
import FullPreviewArtistOverview from "./FullPreviewArtistOverview";
import { createLoader } from "../../state/helpers";

function FullPreviewArtist() {
  const data = useLoaderData() as ArtistType;
  const navigate = useNavigate();

  console.log(data);

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-scroll bg-amber-800 p-3 md:p-4">
      <button className="self-start" onClick={() => navigate("/home")}>
        &larr;
      </button>
      <FullPreviewArtistOverview data={data} />
      <PlaylistPreviewHeader />
      {/* <FullPreviewTracks tracks={tracksArr} /> */}
    </div>
  );
}

export default FullPreviewArtist;

const { getArtist } = useStateStore.getState();

export const artistLoader = createLoader<ArtistType>("artist", getArtist);
