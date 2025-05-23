import { TopTrackType } from "../artists/artist";
import FPAlbumTrackItem from "./FPAlbumTrackItem";

interface FPAlbumTracksProps {
  tracks: TopTrackType[];
}

function FPAlbumTracks({ tracks }: FPAlbumTracksProps) {
  return (
    <section className="h-full bg-amber-300">
      <article>
        {tracks.map((track, i) => (
          <FPAlbumTrackItem key={track.id} index={i} track={track} />
        ))}
      </article>
    </section>
  );
}

export default FPAlbumTracks;
