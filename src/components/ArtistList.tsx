import { useNavigate } from "react-router";
import { RequireAtLeastOne } from "../types/requireAtLeastOneProp";

export type Artist = {
  uri?: string;
  name: string;
} & RequireAtLeastOne<{
  id: string;
  artistId: string;
}>;

interface ArtistListProps {
  artists: Artist[];
  addClassName?: string;
}

function ArtistList({ artists, addClassName = "" }: ArtistListProps) {
  const navigate = useNavigate();

  const handleArtistSelect = (artist: Artist) => {
    // Handle different ID formats from different parts of the app
    if (artist.uri) {
      const id = artist.uri.split(":")[2];
      navigate(`/home/artist/${id}`);
    } else if (artist.id) {
      navigate(`/home/artist/${artist.id}`);
    } else if (artist.artistId) {
      navigate(`/home/artist/${artist.artistId}`);
    }
  };

  return (
    <>
      {artists?.map((artist, i, array) => (
        <span
          key={`${artist.id || artist.artistId || artist.uri}-${i}`}
          onClick={() => handleArtistSelect(artist)}
          className={`cursor-pointer underline-offset-1 hover:underline ${addClassName}`}
        >
          {i + 1 === array.length ? artist.name : `${artist.name}, `}
        </span>
      ))}
    </>
  );
}

export default ArtistList;
