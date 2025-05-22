import { ShortArtistType } from "./search";

interface ArtistCardProps {
  artist: ShortArtistType;
}

function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <article
      className={`flex h-56 min-w-44 flex-col items-center gap-2 bg-amber-400 p-2`}
    >
      <img
        className={`h-40 w-40 rounded-full`}
        src={artist.imageUrl}
        alt={artist.name}
      />
      <h4>{artist.name}</h4>
    </article>
  );
}

export default ArtistCard;
