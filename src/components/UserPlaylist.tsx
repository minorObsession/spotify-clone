import { useNavigate } from "react-router";
import { UserPlaylistType } from "../state/playlists";
import Thumbnail from "./Thumbnail";

function UserPlaylist({ name, images, id, ownerName }: UserPlaylistType) {
  // console.log(id);
  const navigate = useNavigate();

  return (
    <div
      className="playlist-item cursor-pointer gap-x-2 hover:bg-amber-300 md:gap-x-3"
      onClick={() => navigate(`/home/playlist/${id}`)}
    >
      <Thumbnail img={images[0].url} />
      <p className="playlist-title">{name}</p>
      <p className="playlist-owner">{ownerName}</p>
    </div>
  );
}

export default UserPlaylist;
