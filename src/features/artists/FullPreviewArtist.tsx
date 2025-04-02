import { useLoaderData } from "react-router-dom";

import { useStateStore } from "../../state/store";
import { ArtistType } from "./artist";
import FullPreviewArtistOverview from "./FullPreviewArtistOverview";
import { createLoader } from "../../state/helpers";
import BackToHomeButton from "../../components/BackToHomeButton";
import FullPreviewTracks from "../tracks/FullPreviewTracks";

function FullPreviewArtist() {
  const data = useLoaderData() as ArtistType;
  //
  console.log(data);

  return (
    <div className={`fullPreviewContainer`}>
      <BackToHomeButton />

      <FullPreviewArtistOverview data={data} />
      {/* <PlaylistPreviewHeader /> */}
      <FullPreviewTracks tracks={data.topTracks} />
    </div>
  );
}

export default FullPreviewArtist;

const { getArtist } = useStateStore.getState();

export const artistLoader = createLoader<ArtistType>("artist", getArtist);
