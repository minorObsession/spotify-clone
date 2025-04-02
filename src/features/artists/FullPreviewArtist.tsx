import {
  ActionFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { useStateStore } from "../../state/store";

import { ArtistType } from "./artist";
import PlaylistPreviewHeader from "../playlists/PlaylistPreviewHeader";
import FullPreviewArtistOverview from "./FullPreviewArtistOverview";

function FullPreviewArtist() {
  // ! from url decide the type - playlist, show or album
  // ! type it
  const data = useLoaderData() as ArtistType;
  const navigate = useNavigate();

  console.log(data);

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-scroll bg-amber-800 p-3 md:p-4">
      <button className="self-start" onClick={() => navigate("/home")}>
        &larr;
      </button>
      <FullPreviewArtistOverview data={data} />
      <PlaylistPreviewHeader />
      {/* <FullPreviewTracks tracks={tracksArr} /> */}
    </div>
  );
}

// ! ABSTRACT CREATING LOADED FUNCTIONS!!!
export async function loader({
  params,
}: ActionFunctionArgs): Promise<ArtistType> {
  // * from url decide the type - playlist, show or album and call corresponding function

  // ! no playlist in LS - fetch it from API

  const { getArtist } = useStateStore.getState();

  if (!params.id || typeof params.id !== "string") {
    console.error("🚨 ❌ Invalid artist ID:", params.id);
    throw new Response("Invalid artist ID", { status: 400 });
  }

  try {
    const playlist = await getArtist(params.id);
    if (!playlist) {
      throw new Response("artist not found", { status: 404 });
    }

    return playlist;
  } catch (error) {
    console.error("🚨 ❌ Failed to load artist:", error);
    throw new Response("Failed to fetch artist", { status: 500 });
  }
}

export default FullPreviewArtist;
