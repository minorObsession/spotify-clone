import FPPlaylistTrackItem from "./FPPlaylistTrackItem";
import { TrackType } from "./track";

interface FPPlaylistTracksProps {
  tracks: TrackType[];
  sentinelRef: React.RefObject<HTMLDivElement>;
}

function FPPlaylistTracks({ tracks, sentinelRef }: FPPlaylistTracksProps) {
  return (
    <section className="h-full bg-amber-300">
      {/* <article> */}
      {tracks.map((track, i) => (
        <FPPlaylistTrackItem key={track.trackId} index={i} track={track} />
      ))}
      {/* Sentinel placed after track 30 or the last one if fewer */}
      {/* // ! NEED BETTER CONDITION HERE */}
      {tracks.length >= 30 && <div ref={sentinelRef} className="h-1" />}
      {/* </article> */}
    </section>
  );
}

export default FPPlaylistTracks;
