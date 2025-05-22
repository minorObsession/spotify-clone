import { ShortAudiobookType } from "./search";
import GenericCard from "../../components/GenericCard";

interface AudiobookCardProps {
  audiobook: ShortAudiobookType;
}

function AudiobookCard({ audiobook }: AudiobookCardProps) {
  // ! audiobookFooter for bottom of the card
  const audiobookFooter = (
    <p className="opacity-80">
      {audiobook.authors.map((author) => author.name).join(", ")}
    </p>
  );

  return (
    <GenericCard
      imageUrl={audiobook.imageUrl}
      name={audiobook.name}
      footer={audiobookFooter}
      onPlayClick={() => {
        // ! figure out what to play when clicked
      }}
    />
  );
}

export default AudiobookCard;
