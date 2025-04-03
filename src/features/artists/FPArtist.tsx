import { useLoaderData } from "react-router-dom";

import { useStateStore } from "../../state/store";
import { ArtistType } from "./artist";
import FPArtistOverview from "./FPArtistOverview";
import { createLoader } from "../../state/helpers";
import BackToHomeButton from "../../components/BackToHomeButton";
import FPArtistTracks from "./FPArtistTracks";

function FPArtist() {
  const data = useLoaderData() as ArtistType;

  return (
    <div className={`fullPreviewContainer`}>
      <BackToHomeButton />

      <FPArtistOverview data={data} />
      {/* <PlaylistPreviewHeader /> */}
      <FPArtistTracks tracks={data.topTracks} />
    </div>
  );
}

export default FPArtist;

const { getArtist } = useStateStore.getState();

export const artistLoader = createLoader<ArtistType>("artist", getArtist);
