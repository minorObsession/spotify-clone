import { TopTrackType } from "./artist";
import FPArtistsTrackItem from "./FPArtistTrackItem";

interface FPArtistTracksProps {
  tracks: TopTrackType[];
}

function FPArtistTracks({ tracks }: FPArtistTracksProps) {
  return (
    <section className="h-full bg-amber-300">
      <article>
        {tracks.map((track, i) => (
          <FPArtistsTrackItem key={track.id} index={i} track={track} />
        ))}
      </article>
    </section>
  );
}

export default FPArtistTracks;
