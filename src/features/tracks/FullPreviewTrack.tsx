import { useLoaderData, useNavigate } from "react-router-dom";
import { useStateStore } from "../../state/store";
import { TrackType } from "./track";
import FullPreviewOverview from "../../components/FullPreviewOverview";
import { createLoader } from "../../state/helpers";

function FullPreviewTrack() {
  // ! from url decide the type - playlist, show or album
  // ! type it
  const data = useLoaderData() as TrackType;
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-scroll bg-amber-800 p-3 md:p-4">
      <button className="self-start" onClick={() => navigate("/home")}>
        &larr;
      </button>
      <FullPreviewOverview data={data} />
      {/* <PlaylistPreviewHeader /> */}
      {/* <FullPreviewTracks tracks={tracksArr} /> */}
    </div>
  );
}

const { getTrack } = useStateStore.getState();
export const trackLoader = createLoader<TrackType>("track", getTrack);

export default FullPreviewTrack;
