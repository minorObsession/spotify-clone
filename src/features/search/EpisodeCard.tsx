import { ShortEpisodeType } from "./search";
import GenericCard from "../../components/GenericCard";

interface EpisodeCardProps {
  episode: ShortEpisodeType;
}

function EpisodeCard({ episode }: EpisodeCardProps) {
  // ! audiobookFooter for bottom of the card
  const episodeFooter = <p className="opacity-80">episode footrer...</p>;

  return (
    <GenericCard
      imageUrl={episode.imageUrl}
      name={episode.name}
      footer={episodeFooter}
      onPlayClick={() => {
        // ! figure out what to play when clicked
      }}
    />
  );
}

export default EpisodeCard;
