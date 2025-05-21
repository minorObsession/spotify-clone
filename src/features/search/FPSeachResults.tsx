import { useStateStore } from "../../state/store";
import FPArtistTrackItem from "../artists/FPArtistTrackItem";

function FPSeachResults() {
  const searchResults = useStateStore((store) => store.searchResults);
  const searchFilters = useStateStore((store) => store.searchFilters);
  const topResult = useStateStore((store) => store.topResult);

  return (
    // ! whole search results container
    <div>
      {/* // ! TOP RESULT */}
      <article className="flex flex-col">
        <article>
          {/* // ! top artist result */}
          <h3>Top result</h3>
          <div>
            <img />
            <h4>Name</h4>
            <p>Artist</p>
          </div>
        </article>
        <article>
          <h3>Songs</h3>
          <div>
            {topResult?.topTracks.map((track) => (
              <FPArtistTrackItem key={track.id} track={track} />
            ))}
          </div>
        </article>
      </article>

      {/* // ! ARTISTS */}
      <article></article>
      {/* // ! ALBUMS */}
      <article></article>
      {/* // ! PLAYLISTS */}
      <article></article>
      {/* // ! PODCASTS / SHOWS*/}
      <article></article>
      {/* // ! EPISODES */}
      <article></article>
      {/* // ! AUDIOBOOKS */}
      <article></article>
    </div>
  );
}

export default FPSeachResults;
