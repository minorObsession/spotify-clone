import FullPreviewTrackItem from "./FullPreviewTrackItem";

interface FullPreviewTracksProps {
  tracks: any[];
}

function FullPreviewTracks({ tracks }: FullPreviewTracksProps) {
  return (
    <section className="h-full bg-amber-300">
      <article>
        {tracks.map((track, i) => (
          // ! problem is the playlist uses trackItem which depend on track that is still null at this time
          <FullPreviewTrackItem key={i} index={i} track={track.track} />
        ))}
      </article>
    </section>
  );
}

export default FullPreviewTracks;
