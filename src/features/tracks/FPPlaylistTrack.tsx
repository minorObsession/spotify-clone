import { useLoaderData } from "react-router-dom";
import { useStateStore } from "../../state/store";
import { TrackType } from "./track";
import { createLoader } from "../../state/helpers";

import FPTrackOverview from "./FPTrackOverview";
import FPControls from "../../components/FPControls";
import { trackOptions } from "../../config/menuOptions";

function FPPlaylistTrack() {
  const data = useLoaderData() as TrackType;

  return (
    <div className={`fullPreviewContainer gap-4`}>
      {/* <BackButton /> */}
      <FPTrackOverview data={data} />
      <FPControls previewType="track" item={data} options={trackOptions} />
      {/* <PlaylistPreviewHeader /> */}
      {/* <FPPlaylistTracks tracks={tracksArr} /> */}
    </div>
  );
}

export const trackLoader = createLoader<TrackType>("track", async (id) => {
  const { getTrack } = useStateStore.getState();
  if (!id) return null;
  const track = await getTrack(id);
  if (!track.success) return null;
  return track.data;
});

export default FPPlaylistTrack;
