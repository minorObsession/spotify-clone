import { ShortPodcastType } from "./search";
import GenericCard from "../../components/GenericCard";

interface PodcastCardProps {
  podcast: ShortPodcastType;
}

function PodcastCard({ podcast }: PodcastCardProps) {
  // ! podcastFooter for bottom of the card
  const podcastFooter = (
    <p className="opacity-80">{podcast.publisher || "PLACEHOLDER"}</p>
  );

  return (
    <GenericCard
      isPodcast={true}
      imageUrl={podcast.imageUrl}
      name={podcast.name}
      footer={podcastFooter}
      onPlayClick={() => {
        // ! figure out what to play when clicked
      }}
    />
  );
}

export default PodcastCard;
