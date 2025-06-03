import { ShortPodcastType } from "./search";
import GenericCard from "../../components/GenericCard";
import { useNavigate } from "react-router";

interface PodcastCardProps {
  podcast: ShortPodcastType;
}

function PodcastCard({ podcast }: PodcastCardProps) {
  const navigate = useNavigate();
  // ! podcastFooter for bottom of the card
  const podcastFooter = <p className="opacity-80">{podcast.publisher}</p>;

  return (
    <GenericCard
      isPodcast={true}
      imageUrl={podcast.imageUrl}
      name={podcast.name}
      footer={podcastFooter}
      onClick={() => {
        navigate(`/home/podcast/${podcast.id}`);
      }}
      onPlayClick={() => {
        // ! figure out what to play when clicked
      }}
    />
  );
}

export default PodcastCard;
