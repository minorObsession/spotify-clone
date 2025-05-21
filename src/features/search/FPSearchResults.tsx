import { useLoaderData } from "react-router";
import { createLoader } from "../../state/helpers";
import { useStateStore } from "../../state/store";
import FPArtistTrackItem from "../artists/FPArtistTrackItem";
import { SearchResultType } from "./search";

function FPSearchResults() {
  const data = useLoaderData() as SearchResultType;
  console.log(data);
  const searchResults = useStateStore((store) => store.searchResults);
  const topResult = useStateStore((store) => store.topResult);

  if (!searchResults) return null;

  return (
    // ! whole search results container
    <div>
      {/* // ! TOP RESULT */}
      <article className="flex flex-col">
        <article>
          {/* // ! top artist result */}
          <h3>Top result</h3>
          <div>
            <img src={topResult?.imageUrl} alt={topResult?.artistName} />
            <h4>{topResult?.artistName}</h4>
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

export default FPSearchResults;

const search = useStateStore.getState().search;

export const searchLoader = createLoader<SearchResultType>("search", search);
