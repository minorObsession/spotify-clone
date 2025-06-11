import FPPodcastEpisode from "./FPPodcastEpisode";
import { PodcastEpisodeType } from "./podcast";

interface FPPodcastEpisodesProps {
  episodes: PodcastEpisodeType[];
}

function FPPodcastEpisodes({ episodes }: FPPodcastEpisodesProps) {
  // todo: ONLY PRELOAD ABOUT 10 EPISODES
  // AND THEN LOAD MORE ON SCROLL

  return (
    <div className="flex w-2/3 flex-col gap-2">
      <h2 className="text-2xl font-bold">Episodes</h2>
      <div className="flex flex-col gap-4">
        {episodes.map((episode: PodcastEpisodeType) => (
          <FPPodcastEpisode key={episode.id} episode={episode} />
        ))}
      </div>
    </div>
  );
}

export default FPPodcastEpisodes;
