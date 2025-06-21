import { useLoaderData, useNavigate } from "react-router";
import { createLoader } from "../../state/helpers";
import { useStateStore } from "../../state/store";
import { SearchResultType } from "./search";
import FPSearchTopTrack from "./FPSearchTopTrack";
import ArtistCard from "./ArtistCard";
import { useResponsiveCards1Row } from "../../hooks/useResponsiveCards1Row";

import PlaylistCard from "./PlaylistCard";
import PodcastCard from "./PodcastCard";
import EpisodeCard from "./EpisodeCard";
import AudiobookCard from "./AudiobookCard";
import SearchResultSection from "../../components/SearchResultSection";
import { useState } from "react";
import { IoMdPlay } from "react-icons/io";
import AlbumCard from "./AlbumCard";

import FPFiltered from "./FPFiltered";
import FPFTracks from "./FPFTracks";

function FPSearchResults() {
  const searchResults = useLoaderData() as SearchResultType;

  console.log(searchResults);
  const topResult = useStateStore((store) => store.topResult);
  const [isTopArtistHovered, setIsTopArtistHovered] = useState(false);
  const navigate = useNavigate();
  const numCards = useResponsiveCards1Row({
    itemWidth: 180 + 8, // card width + gap
    containerSelector: "main", // relative to main el
  });

  const { searchFilter } = useStateStore((store) => store);
  console.log(searchFilter);

  if (!searchResults) return null;

  return (
    // ! whole search results container
    <div className="flex flex-col gap-6">
      {searchFilter === "track" && <FPFTracks tracks={searchResults.tracks} />}
      {searchFilter !==
        "track,artist,album,playlist,show,episode,audiobook" && (
        <SearchResultSection fullPage>
          <FPFiltered filter={`${searchFilter}s`} />
        </SearchResultSection>
      )}

      {/* // ! WHEN NO FILTER */}
      {searchFilter ===
        "track,artist,album,playlist,show,episode,audiobook" && (
        <>
          <article className="grid grid-cols-1 grid-rows-1 gap-4 lg:grid-cols-[1fr_1.5fr]">
            {/* // ! top result container */}
            <article
              onMouseEnter={() => setIsTopArtistHovered(true)}
              onMouseLeave={() => setIsTopArtistHovered(false)}
              className="relative grid grid-cols-1 grid-rows-[1fr_6fr]"
              onClick={() => {
                navigate(`/home/artist/${topResult?.id}`);
              }}
            >
              {/* // ! top artist result */}
              <h3 className="text-2xl font-bold">Top result</h3>
              <div className="flex cursor-pointer flex-col rounded-xl p-5 hover:bg-amber-500">
                <img
                  className={`mb-2 h-32 w-32 rounded-full`}
                  src={topResult?.imageUrl}
                  alt={topResult?.name}
                />

                <IoMdPlay
                  className={`green-play-pause-button absolute right-1/10 bottom-1/8 transform ${isTopArtistHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} transition-all duration-200`}
                  size={48}
                  // ! figure out what to play when clicked
                  onClick={() => {}}
                />
                <h4
                  onClick={() => {
                    navigate(`/home/artist/${topResult?.id}`);
                  }}
                  className="text-3xl font-bold hover:underline"
                >
                  {topResult?.name}
                </h4>
                <p>Artist</p>
              </div>
            </article>

            {/* // ! top tracks container */}
            <article className="grid grid-cols-1 grid-rows-[1fr_6fr]">
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
          <SearchResultSection title="Artists">
            {searchResults?.artists
              ?.slice(0, numCards)
              .map((artist) => <ArtistCard key={artist.id} artist={artist} />)}
          </SearchResultSection>
          <SearchResultSection title="Albums">
            {searchResults?.albums
              ?.slice(0, numCards)
              .map((album) => <AlbumCard key={album.id} album={album} />)}
          </SearchResultSection>
          <SearchResultSection title="Playlists">
            {searchResults?.playlists
              ?.slice(0, numCards)
              .map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
          </SearchResultSection>
          <SearchResultSection title="Podcasts">
            {searchResults?.podcasts
              ?.slice(0, numCards)
              .map((podcast) => (
                <PodcastCard key={podcast.id} podcast={podcast} />
              ))}
          </SearchResultSection>
          <SearchResultSection title="Episodes">
            {searchResults?.episodes
              ?.slice(0, numCards)
              .map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
          </SearchResultSection>
          <SearchResultSection title="Audiobooks">
            {searchResults?.audiobooks
              ?.slice(0, numCards)
              .map((audiobook) => (
                <AudiobookCard key={audiobook.id} audiobook={audiobook} />
              ))}
          </SearchResultSection>{" "}
        </>
      )}
    </div>
  );
}

export default FPSearchResults;

export const searchLoader = createLoader<SearchResultType>(
  "search",
  async (query?: string) => {
    if (!query) return null;
    const { search } = useStateStore.getState();
    const searchResults = await search(query);
    if (!searchResults.success) return null;

    return searchResults.data;
  },
);
