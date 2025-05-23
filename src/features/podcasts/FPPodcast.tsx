import { memo } from "react";
import { useLoaderData } from "react-router-dom";
import { createLoader } from "../../state/helpers";
import { useStateStore } from "../../state/store";
import BackToHomeButton from "../../components/BackToHomeButton";
import FPControls from "../../components/FPControls";
import { PodcastType } from "./types";
import { podcastOptions } from "../../config/menuOptions";
import FPPodcastEpisodes from "./FPPodcastEpisode";
import FPPodcastOverview from "./FPPodcastOverview";

function FullPreviewPodcast() {
  const podcast = useLoaderData() as PodcastType;

  return (
    <div className="fullPreviewContainer gap-6">
      <BackToHomeButton />
      <FPPodcastOverview data={podcast} />
      <FPControls
        item={podcast}
        previewType="podcast"
        options={podcastOptions}
      />
      <FPPodcastEpisodes episodes={podcast.episodes} />
    </div>
  );
}

export default memo(FullPreviewPodcast);

const { getPodcast } = useStateStore.getState();

export const podcastLoader = createLoader<PodcastType>("podcast", getPodcast);
