import { useLoaderData } from "react-router-dom";
import { useStateStore } from "../../state/store";
import { TrackType } from "./track";
import { createLoader } from "../../state/helpers";
import BackToHomeButton from "../../components/BackToHomeButton";
import FPTrackOverview from "./FPTrackOverview";

function FPPlaylistTrack() {
  const data = useLoaderData() as TrackType;

  return (
    <div className={`fullPreviewContainer`}>
      <BackToHomeButton />
      <FPTrackOverview data={data} />
      {/* <PlaylistPreviewHeader /> */}
      {/* <FPPlaylistTracks tracks={tracksArr} /> */}
    </div>
  );
}

const { getTrack } = useStateStore.getState();
export const trackLoader = createLoader<TrackType>("track", getTrack);

export default FPPlaylistTrack;
