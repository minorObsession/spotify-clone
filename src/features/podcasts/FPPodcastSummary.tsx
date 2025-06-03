import { PodcastType } from "./podcast";
import { useState } from "react";

interface FPPodcastSummaryProps {
  podcast: PodcastType;
}

function FPPodcastSummary({ podcast }: FPPodcastSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex w-1/3 flex-col gap-2">
      <h2 className="text-2xl font-bold">About</h2>
      <div>
        <p className={`${!isExpanded ? "line-clamp-4" : ""}`}>
          {podcast.description}
        </p>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="font- text-sm text-neutral-400 hover:text-white"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      </div>

      {/* // ! couldn't find this data in API response */}
      {/* podcast trailer box */}
      <div></div>

      {/* podcast rating + tags box */}
    </div>
  );
}

export default FPPodcastSummary;
