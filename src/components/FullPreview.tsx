import {
  ActionFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { useStateStore } from "../state/store";
import Thumbnail from "./Thumbnail";

function FullPreview() {
  // ! from url decide the type - playlist, show or album
  const data = useLoaderData();
  const navigate = useNavigate();
  console.log(data);

  // data.tracks.items (length)
  // ! items.forEach (item) ->
  // 1) item.track.duration_ms... add up total duration;
  // 2) item.track.name.artists ->  (arr).forEach (artist)-> artist.name (to display name)
  // data.images[0]
  // data.owner.display_name
  // data.owner.id - to look for avatar image

  return (
    <div className="h-full w-full bg-amber-800 p-3 md:p-4">
      <button onClick={() => navigate("/home")}>&larr;</button>

      {/* // ! image and title */}
      <div className="flex gap-3">
        {/* Image */}
        {/* // !  */}
        <div className="">
          <Thumbnail
            img="https://mosaic.scdn.co/640/ab67616d00001e024ca68d59a4a29c856a4a39c2ab67616d00001e025fd7c284c0b719ad07b8eac2ab67616d00001e0270b88fc5a2e13bc5440d947cab67616d00001e029e1cfc756886ac782e363d79"
            width="w-full"
          />
        </div>

        {/* // ! Info Div */}
        <div className="grid max-w-[30%] grid-rows-[1fr_4fr_1fr] items-center">
          <h5 className="">{data?.type}</h5>
          <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
            {data?.name}
          </h1>
          {/* // ! user div */}
          <div className="flex items-center gap-1">
            <p>img</p>
            <span>{data.owner.display_name}</span>
            <span>length</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function loader({ params }: ActionFunctionArgs) {
  // * from url decide the type - playlist, show or album and call corresponding function

  // ! check if already in LS

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
