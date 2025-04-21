import FPPlaylistTrackItem from "./FPPlaylistTrackItem";
import { TrackType } from "./track";

interface FPPlaylistTracksProps {
  tracks: TrackType[];
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

function FPPlaylistTracks({ tracks, sentinelRef }: FPPlaylistTracksProps) {
  return (
    <section className="h-full bg-amber-300">
      {tracks.map((track, i) => (
        <FPPlaylistTrackItem key={track.trackId || i} index={i} track={track} />
      ))}
      {/* // ! NEED BETTER CONDITION HERE */}
      <div ref={sentinelRef} style={{ height: "10px", background: "red" }} />
    </section>
  );
}

export default FPPlaylistTracks;
