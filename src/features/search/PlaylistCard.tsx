import { ShortPlaylistType } from "./search";
import GenericCard from "../../components/GenericCard";
import { useNavigate } from "react-router";

interface PlaylistCardProps {
  playlist: ShortPlaylistType;
}

function PlaylistCard({ playlist }: PlaylistCardProps) {
  const navigate = useNavigate();
  // ! playlistFooter for bottom of the card
  const playlistFooter = <p className="opacity-80">pLAYLIST FOOTER </p>;

  return (
    <GenericCard
      imageUrl={playlist.imageUrl}
      name={playlist.name}
      footer={playlistFooter}
      onClick={() => {
        navigate(`/home/playlist/${playlist.id}`);
      }}
      onPlayClick={() => {
        // ! figure out what to play when clicked
      }}
    />
  );
}

export default PlaylistCard;
