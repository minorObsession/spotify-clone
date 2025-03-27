import FullPreviewTrack from "./FullPreviewTrack";

interface FullPreviewTracksProps {
  tracks: any[];
}

function FullPreviewTracks({ tracks }: FullPreviewTracksProps) {
  return (
    <section className="h-full bg-amber-300">
      <article>
        {tracks.map((track) => (
          <FullPreviewTrack track={track.track} />
        ))}
      </article>
    </section>
  );
}

export default FullPreviewTracks;
