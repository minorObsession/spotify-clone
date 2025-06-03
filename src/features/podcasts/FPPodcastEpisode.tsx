import AddToEpisodes from "./AddToEpisodes";
import PlayButton from "../../components/PlayButton";
import { useStateStore } from "../../state/store";
import { PodcastEpisodeType } from "./podcast";

interface FPPodcastEpisodeProps {
  episode: PodcastEpisodeType;
}

function FPPodcastEpisode({ episode }: FPPodcastEpisodeProps) {
  const { playTrack } = useStateStore((state) => state);

  const handlePlayEpisode = (episodeId: string) => {
    playTrack(`spotify:episode:${episodeId}`, "podcast");
  };

  return (
    <div
      key={episode.id}
      className="flex cursor-pointer gap-6 rounded-md p-4 hover:bg-neutral-800"
    >
      <img
        src={episode.imageUrl}
        alt={episode.name}
        className="h-32 w-32 basis-1/8 rounded-md object-cover"
      />
      <div className="flex flex-col gap-1 rounded-md">
        <h3 className="font-medium">{episode.name}</h3>
        <p className="line-clamp-3 text-sm">{episode.description}</p>
        <div className="flex items-center gap-2 text-sm">
          <span>{new Date(episode.releaseDate).toLocaleDateString()}</span>
          <span>•</span>
          <span>{Math.round(episode.durationMs / 60000)} min</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AddToEpisodes
              episode={episode}
              id={episode.id}
              isEpisodeHovered={false}
            />
          </div>
          <PlayButton onClick={() => handlePlayEpisode(episode.id)} />
        </div>
      </div>
    </div>
  );
}

export default FPPodcastEpisode;
