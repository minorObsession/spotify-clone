import {
  ActionFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { useStateStore } from "../state/store";
import FullPreviewOverview from "./FullPreviewOverview";
import { DetailedPlaylistType } from "../state/playlists";
import FullPreviewTracks from "./FullPreviewTracks";
import PlaylistPreviewHeader from "./PlaylistPreviewHeader";

// ! BUILDING THE PREVIRE PAGE
function FullPreview() {
  // ! from url decide the type - playlist, show or album
  // ! type it
  const data = useLoaderData() as DetailedPlaylistType;
  const navigate = useNavigate();

  // data.id
  // data.tracks.items (length)
  // ! items.forEach (item) ->
  // 1) item.track.duration_ms... add up total duration;
  // 2) item.track.name.artists ->  (arr).forEach (artist)-> artist.name (to display name)
  // data.images[0]
  // data.owner.display_name
  // data.owner.id - to look for avatar image

  const rawTracks = (data as unknown as { tracks: any }).tracks;
  const tracksArr = Array.isArray(rawTracks) ? rawTracks : rawTracks.items;

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-scroll bg-amber-800 p-3 md:p-4">
      <button className="self-start" onClick={() => navigate("/home")}>
        &larr;
      </button>
      <FullPreviewOverview data={data} />
      <PlaylistPreviewHeader />
      <FullPreviewTracks tracks={tracksArr} />
    </div>
  );
}
export async function loader({
  params,
}: ActionFunctionArgs): Promise<DetailedPlaylistType> {
  // * from url decide the type - playlist, show or album and call corresponding function

  // ! no playlist in LS - fetch it from API

  const { getPlaylistOrShow } = useStateStore.getState();

  if (!params.id || typeof params.id !== "string") {
    console.error("🚨 ❌ Invalid playlist/show ID:", params.id);
    throw new Response("Invalid playlist/show ID", { status: 400 });
  }

  try {
    const playlist = await getPlaylistOrShow(params.id);
    if (!playlist) {
      throw new Response("Playlist/show not found", { status: 404 });
    }

    return playlist;
  } catch (error) {
    console.error("🚨 ❌ Failed to load playlist/show:", error);
    throw new Response("Failed to fetch playlist/show", { status: 500 });
  }
}

export default FullPreview;
