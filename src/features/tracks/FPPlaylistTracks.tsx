import FPPlaylistTrackItem from "./FPPlaylistTrackItem";
import { TrackType } from "./track";

interface FPPlaylistTracksProps {
  tracks: TrackType[];
}

function FPPlaylistTracks({ tracks }: FPPlaylistTracksProps) {
  return (
    <section className="h-full bg-amber-300">
      <article>
        {tracks.map((track, i) => (
          <FPPlaylistTrackItem key={track.trackId} index={i} track={track} />
        ))}
      </article>
    </section>
  );
}

export default FPPlaylistTracks;
