import { useLoaderData } from "react-router-dom";
import { useStateStore } from "../../state/store";
import { TrackType } from "./track";
import { createLoader } from "../../state/helpers";
import BackToHomeButton from "../../components/BackToHomeButton";
import FullPreviewTrackOverview from "./FullPreviewTrackOverview";

function FullPreviewTrack() {
  const data = useLoaderData() as TrackType;

  return (
    <div className={`fullPreviewContainer`}>
      <BackToHomeButton />
      <FullPreviewTrackOverview data={data} />
      {/* <PlaylistPreviewHeader /> */}
      {/* <FullPreviewTracks tracks={tracksArr} /> */}
    </div>
  );
}

const { getTrack } = useStateStore.getState();
export const trackLoader = createLoader<TrackType>("track", getTrack);

export default FullPreviewTrack;
