import { useLoaderData } from "react-router";
import { createLoader } from "../../state/helpers";
import { useStateStore } from "../../state/store";
import { SearchResultType } from "./search";
import FPSearchTopTrack from "./FPSearchTopTrack";
import ArtistCard from "./ArtistCard";
import { useResponsiveCards1Row } from "../../hooks/useResponsiveCards1Row";

function FPSearchResults() {
  const searchResults = useLoaderData() as SearchResultType;
  const topResult = useStateStore((store) => store.topResult);
  const numArtistCards = useResponsiveCards1Row({
    itemWidth: 178, // card width + gap
    containerSelector: "main",
  });

  if (!searchResults) return null;

  return (
    // ! whole search results container
    <div className="flex flex-col gap-6">
      {/* // ! TOP RESULT */}
      <article className="grid grid-cols-1 grid-rows-1 gap-4 lg:grid-cols-[1fr_1.5fr]">
        {/* // ! top result container */}
        <article className="">
          {/* // ! top artist result */}
          <h3 className="text-2xl font-bold">Top result</h3>
          <div className="flex flex-col bg-amber-400 p-5">
            <img
              className={`h-32 w-32 rounded-full`}
              src={topResult?.imageUrl}
              alt={topResult?.name}
            />
            <h4 className="text-3xl font-bold">{topResult?.name}</h4>
            <p>Artist</p>
          </div>
        </article>
        {/* // ! top tracks container */}
        <article className="">
          <h3 className="text-2xl font-bold">Songs</h3>
          <div className="flex flex-col gap-0.5">
            {topResult?.topTracks
              .slice(0, 6)
              .map((track) => (
                <FPSearchTopTrack key={track.id} track={track} />
              ))}
          </div>
        </article>
      </article>

      {/* // ! ARTISTS */}
      <article>
        <h3 className="text-2xl font-bold">Artists</h3>
        <div className="flex gap-2 overflow-hidden">
          {searchResults?.artists
            ?.slice(0, numArtistCards)
            .map((artist) => <ArtistCard key={artist.id} artist={artist} />)}
        </div>
      </article>
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
