import { Playlist } from "../state/playlists";
import RecenThumbnail from "./RecentThumbnail";

function UserPlaylist({ name, images, id, ownerName }: Playlist) {
  console.log(id);
  return (
    <div className="playlist-item gap-x-2" onClick={() => {}}>
      <RecenThumbnail img={images[0].url} />

      <p className="playlist-title">{name}</p>
      <p className="playlist-owner">{ownerName}</p>
    </div>
  );
}

export default UserPlaylist;
