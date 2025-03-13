import { Playlist } from "../state/user/user";
import RecenThumbnail from "./RecentThumbnail";

function UserPlaylist({ name, images, id }: Playlist) {
  console.log(images);

  return (
    <div
      className="grid grid-cols-[1fr_3fr] grid-rows-[2fr_1fr] truncate p-1 text-sm"
      onClick={() => {}}
    >
      <RecenThumbnail img={images[0].url} />
      <p>{name}</p>
      <p>{}</p>
    </div>
  );
}

export default UserPlaylist;
