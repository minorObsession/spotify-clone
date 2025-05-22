import { ShortPlaylistType } from "./search";
import GenericCard from "../../components/GenericCard";

interface PlaylistCardProps {
  playlist: ShortPlaylistType;
}

function PlaylistCard({ playlist }: PlaylistCardProps) {
  // ! playlistFooter for bottom of the card
  const playlistFooter = <p className="opacity-80">pLAYLIST FOOTER </p>;

  return (
    <GenericCard
      imageUrl={playlist.imageUrl}
      name={playlist.name}
      footer={playlistFooter}
      onPlayClick={() => {
        // ! figure out what to play when clicked
      }}
    />
  );
}

export default PlaylistCard;
