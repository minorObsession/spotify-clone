import FullPreviewTrackItem from "./FullPreviewTrackItem";
import { TrackType } from "./track";

interface FullPreviewTracksProps {
  tracks: TrackType[];
}

function FullPreviewTracks({ tracks }: FullPreviewTracksProps) {
  return (
    <section className="h-full bg-amber-300">
      <article>
        {tracks.map((track, i) => (
          // ! problem is the playlist uses trackItem which depend on track that is still null at this time
          <FullPreviewTrackItem key={track.trackId} index={i} track={track} />
        ))}
      </article>
    </section>
  );
}

export default FullPreviewTracks;
