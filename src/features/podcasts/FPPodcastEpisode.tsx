import { useStateStore } from "../../state/store";
import { PodcastEpisodeType } from "./podcast";

function FPPodcastEpisodes({ episodes }: { episodes: PodcastEpisodeType[] }) {
  const { playTrack } = useStateStore((state) => state);

  const handlePlayEpisode = (episodeId: string) => {
    playTrack(`spotify:episode:${episodeId}`, "podcast");
  };

  // todo: ONLY PRELOAD ABOUT 10 EPISODES
  // AND THEN LOAD MORE ON SCROLL

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-bold">Episodes</h2>
      <div className="flex flex-col gap-4">
        {episodes.map((episode: PodcastEpisodeType) => (
          <div
            key={episode.id}
            className="flex cursor-pointer gap-6 rounded-md p-4 hover:bg-neutral-800"
            onClick={() => handlePlayEpisode(episode.id)}
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
                <span>
                  {new Date(episode.releaseDate).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>{Math.round(episode.durationMs / 60000)} min</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FPPodcastEpisodes;
