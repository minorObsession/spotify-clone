import { Playlist } from "../state/playlists";
import RecenThumbnail from "./RecentThumbnail";

function UserPlaylist({ name, images, id, ownerName }: Playlist) {
  return (
    <div
      className="grid grid-cols-[1fr_4fr] grid-rows-[2fr_1fr] gap-2 truncate p-1 text-sm"
      onClick={() => {}}
    >
      <RecenThumbnail img={images[0].url} />
      <p className="truncate text-xs sm:text-sm">{name}</p>
      <p>{ownerName}</p>
    </div>
  );
}

export default UserPlaylist;
