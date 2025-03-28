import {
  ActionFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { useStateStore } from "../../state/store";
import { DetailedPlaylistType } from "./playlists";
import FullPreviewTracks from "../tracks/FullPreviewTracks";
import PlaylistPreviewHeader from "./PlaylistPreviewHeader";
import FullPreviewOverview from "../../components/FullPreviewOverview";

function FullPreviewPlaylist() {
  // ! from url decide the type - playlist, show or album
  // ! type it
  const data = useLoaderData() as DetailedPlaylistType;
  const navigate = useNavigate();

  const rawTracks = (data as unknown as { tracks: any }).tracks;
  const tracksArr = Array.isArray(rawTracks) ? rawTracks : rawTracks.items;
  console.log(tracksArr);

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

export default FullPreviewPlaylist;
