import FPAlbumTrackItem from "../albums/FPAlbumTrackItem";
import { TopTrackType } from "../artists/artist";

interface FPFTracksProps {
  tracks: TopTrackType[];
}

function FPFTracks({ tracks }: FPFTracksProps) {
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

export default FPFTracks;
