import FullPreviewTrackItem from "./FullPreviewTrackItem";

interface FullPreviewTracksProps {
  tracks: any[];
}

function FullPreviewTracks({ tracks }: FullPreviewTracksProps) {
  return (
    <section className="h-full bg-amber-300">
      <article>
        {tracks.map((track, i) => (
          <FullPreviewTrackItem
            key={track.name}
            index={i}
            track={track.track}
          />
        ))}
      </article>
    </section>
  );
}

export default FullPreviewTracks;
