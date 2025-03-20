import {
  ActionFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { useStateStore } from "../state/store";

function FullPreview() {
  // ! from url decide the type - playlist, show or album
  const data = useLoaderData();
  const navigate = useNavigate();
  console.log(data.type);
  return (
    <div className="h-full w-full bg-amber-800 p-3 md:p-4">
      <h1>type:{data?.type}</h1>
      <button onClick={() => navigate("/home")}>&larr;</button>
    </div>
  );
}

export async function loader({ params }: ActionFunctionArgs) {
  // * from url decide the type - playlist, show or album and call corresponding function

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
