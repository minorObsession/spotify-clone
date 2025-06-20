import { useState } from "react";
import { ShortArtistType } from "./search";
import { IoMdPlay } from "react-icons/io";
import { useNavigate } from "react-router";
import { getPlaceholderImage } from "../../helpers/helperFunctions";

interface ArtistCardProps {
  artist: ShortArtistType;
}

function ArtistCard({ artist }: ArtistCardProps) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const navigate = useNavigate();

  const handleArtistSelect = (id: string) => {
    navigate(`/home/artist/${id}`);
  };

  return (
    <article
      className={`search-view-card relative`}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
      onClick={() => {
        handleArtistSelect(artist.id);
      }}
    >
      <img
        className={`h-40 w-40 rounded-full ${isCardHovered ? "brightness-75" : ""} transition-all duration-100`}
        src={artist.imageUrl || getPlaceholderImage("artist")}
        alt={artist.name}
      />

      <IoMdPlay
        className={`green-play-pause-button absolute top-1/2 right-1/8 transform ${isCardHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-200`}
        size={48}
        // ! figure out what to play when clicked
        onClick={() => {}}
      />

      {/* // ! CARD FOOTER */}
      <h4 className="">{artist.name}</h4>
      <p className="opacity-80">Artist</p>
    </article>
  );
}

export default ArtistCard;
