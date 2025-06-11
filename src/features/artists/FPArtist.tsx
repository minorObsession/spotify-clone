import { useLoaderData } from "react-router-dom";

import { useStateStore } from "../../state/store";
import { ArtistType } from "./artist";
import FPArtistOverview from "./FPArtistOverview";
import { createLoader } from "../../state/helpers";
import BackButton from "../../components/BackButton";
import FPArtistTracks from "./FPArtistTracks";

function FPArtist() {
  const data = useLoaderData() as ArtistType;

  return (
    <div className={`fullPreviewContainer`}>
      <BackButton />

      <FPArtistOverview data={data} />
      <FPArtistTracks tracks={data.topTracks} />
    </div>
  );
}

export default FPArtist;

export const artistLoader = createLoader<ArtistType>("artist", async (id) => {
  if (!id) return null;
  const { getArtist } = useStateStore.getState();
  const artist = await getArtist(id);
  if (!artist.success) return null;

  return artist.data;
});
