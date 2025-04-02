import { useLoaderData } from "react-router-dom";
import { useStateStore } from "../../state/store";
import { TrackType } from "./track";
import FullPreviewOverview from "../../components/FullPreviewPlaylistOverview";
import { createLoader } from "../../state/helpers";
import BackToHomeButton from "../../components/BackToHomeButton";

function FullPreviewTrack() {
  const data = useLoaderData() as TrackType;

  return (
    <div className={`fullPreviewContainer`}>
      <BackToHomeButton />
      <FullPreviewOverview data={data} />
      {/* <PlaylistPreviewHeader /> */}
      {/* <FullPreviewTracks tracks={tracksArr} /> */}
    </div>
  );
}

const { getTrack } = useStateStore.getState();
export const trackLoader = createLoader<TrackType>("track", getTrack);

export default FullPreviewTrack;
