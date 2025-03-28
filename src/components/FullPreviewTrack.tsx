import {
  ActionFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { useStateStore } from "../state/store";
import { TrackType } from "../state/track";
import FullPreviewOverview from "./FullPreviewOverview";

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
export async function loader({
  params,
}: ActionFunctionArgs): Promise<TrackType> {
  // * from url decide the type - playlist, show or album and call corresponding function

  // ! no playlist in LS - fetch it from API

  const { getTrack } = useStateStore.getState();

  if (!params.id || typeof params.id !== "string") {
    console.error("🚨 ❌ Invalid track ID:", params.id);
    throw new Response("Invalid track ID", { status: 400 });
  }

  try {
    const track = await getTrack(params.id);
    if (!track) {
      throw new Response("track not found", { status: 404 });
    }
    console.log(track);
    return track;
  } catch (error) {
    console.error("🚨 ❌ Failed to load track:", error);
    throw new Response("Failed to fetch track", { status: 500 });
  }
}

export default FullPreviewTrack;
