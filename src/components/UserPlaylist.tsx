import { useNavigate } from "react-router";
import Thumbnail from "./Thumbnail";
import { UserPlaylistType } from "../features/playlists/playlists";

function UserPlaylist({ name, images, id, ownerName }: UserPlaylistType) {
  // console.log(id);
  const navigate = useNavigate();

  return (
    <div
      className="playlist-item cursor-pointer gap-x-2 text-sm hover:bg-amber-300 md:gap-x-3"
      onClick={() => navigate(`/home/playlist/${id}`)}
    >
      <Thumbnail img={images[0].url} minWidth="w-12" />
      <p className="playlist-title">{name}</p>
      <p className="playlist-owner">{ownerName}</p>
    </div>
  );
}

export default UserPlaylist;
