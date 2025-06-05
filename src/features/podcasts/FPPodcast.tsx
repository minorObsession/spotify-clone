import { memo } from "react";
import { useLoaderData } from "react-router-dom";
import { createLoader } from "../../state/helpers";
import { useStateStore } from "../../state/store";
import BackButton from "../../components/BackButton";
import FPControls from "../../components/FPControls";
import { PodcastType } from "./podcast";
import { podcastOptions } from "../../config/menuOptions";
import FPPodcastEpisodes from "./FPPodcastEpisodes";
import FPPodcastOverview from "./FPPodcastOverview";
import FPPodcastSummary from "./FPPodcastSummary";

function FullPreviewPodcast() {
  const podcast = useLoaderData() as PodcastType;

  return (
    <div className="fullPreviewContainer gap-6">
      <BackButton />
      <FPPodcastOverview data={podcast} />
      <FPControls
        item={podcast}
        previewType="podcast"
        options={podcastOptions}
      />
      <div className="flex gap-2">
        <FPPodcastEpisodes episodes={podcast.episodes} />
        <FPPodcastSummary podcast={podcast} />
      </div>
    </div>
  );
}

export default memo(FullPreviewPodcast);

const { getPodcast } = useStateStore.getState();

export const podcastLoader = createLoader<PodcastType>("podcast", getPodcast);
