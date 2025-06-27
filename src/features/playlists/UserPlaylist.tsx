import { useNavigate } from "react-router";
import Thumbnail from "../../components/Thumbnail";
import { UserPlaylistType } from "./playlists";

function UserPlaylist({ name, imageUrl, id, ownerName }: UserPlaylistType) {
  const navigate = useNavigate();

  return (
    <article
      data-playlist-id={id}
      className="playlist-item cursor-pointer gap-x-2 text-sm hover:bg-amber-300 md:gap-x-3"
      onClick={() => navigate(`/home/playlist/${id}`)}
    >
      {/* ! images could be just a string */}
      <Thumbnail img={imageUrl} minWidth="w-12" />
      <p className="playlist-title">{name}</p>
      <p className="playlist-owner">{ownerName}</p>
    </article>
  );
}

export default UserPlaylist;
