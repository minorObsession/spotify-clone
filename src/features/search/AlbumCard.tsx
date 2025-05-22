import { ShortAlbumType } from "./search";
import ArtistList, { Artist } from "../../components/ArtistList";
import GenericCard from "../../components/GenericCard";

interface AlbumCardProps {
  album: ShortAlbumType;
}

function AlbumCard({ album }: AlbumCardProps) {
  // ! album footer for bottom of the card
  const albumFooter = (
    <div className="flex items-center justify-center gap-0.5">
      <p className="text-sm opacity-80">{album.releaseYear}</p>
      <span className="text-xs"> &bull;</span>
      <span className="text-xs">
        <ArtistList
          artists={album.artists as Artist[]}
          addClassName="text-sm"
        />
      </span>
    </div>
  );

  return (
    <GenericCard
      imageUrl={album.imageUrl || ""}
      name={album.name}
      footer={albumFooter}
      onPlayClick={() => {
        // ! figure out what to play when clicked
      }}
    />
  );
}

export default AlbumCard;
