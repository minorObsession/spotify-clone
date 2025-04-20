import { useNavigate } from "react-router";
import Thumbnail from "../../components/Thumbnail";
import { UserPlaylistType } from "./playlists";

function UserPlaylist({ name, images, id, ownerName }: UserPlaylistType) {
  const navigate = useNavigate();
  const handlePlaylistClick = () => navigate(`/home/playlist/${id}`);
  console.log(images);
  return (
    <article
      className="playlist-item cursor-pointer gap-x-2 text-sm hover:bg-amber-300 md:gap-x-3"
      onClick={handlePlaylistClick}
    >
      {/* ! images could be just a string */}
      <Thumbnail img={images[0]?.url || images} minWidth="w-12" />
      <p className="playlist-title">{name}</p>
      <p className="playlist-owner">{ownerName}</p>
    </article>
  );
}

export default UserPlaylist;
