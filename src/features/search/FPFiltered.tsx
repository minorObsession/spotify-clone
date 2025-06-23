import SearchResultSection from "../../components/SearchResultSection";
import { useLoadMoreTracksOnScroll } from "../../hooks/useLoadMoreTracksOnScroll";
import { useStateStore } from "../../state/store";
import GenericCard from "../../components/GenericCard";
import { SearchFiltersType, SearchResultType } from "./search";

// ! GOTTA MATCH TYPES HERE WITH SEARCH FILTERS TYPE
// ! GOTTA MATCH TYPES HERE WITH SEARCH FILTERS TYPE
// ! GOTTA MATCH TYPES HERE WITH SEARCH FILTERS TYPE
// ! GOTTA MATCH TYPES HERE WITH SEARCH FILTERS TYPE
// ! GOTTA MATCH TYPES HERE WITH SEARCH FILTERS TYPE
// ! GOTTA MATCH TYPES HERE WITH SEARCH FILTERS TYPE
interface FPFilteredProps {
  filter?: SearchFiltersType;
}

// Function to convert filter to search result type
const getFilterSearchResultType = (
  filter: SearchFiltersType,
): keyof Omit<SearchResultType, "searchQuery"> => {
  switch (filter) {
    case "track":
      return "tracks";
    case "artist":
      return "artists";
    case "album":
      return "albums";
    case "playlist":
      return "playlists";
    case "podcast":
      return "podcasts";
    case "episode":
      return "episodes";
    case "audiobook":
      return "audiobooks";
    default:
      return "tracks";
  }
};

function FPFiltered({
  filter = "track,artist,album,playlist,show,episode,audiobook",
}: FPFilteredProps) {
  const { search, setSearchResults, searchResults } = useStateStore();

  const currentFilter = getFilterSearchResultType(filter);

  const handleLoadMore = async () => {
    if (!searchResults) return;
    console.log(searchResults);
    console.log("FILTER", filter);

    const result = await search(
      searchResults.searchQuery,
      searchResults[currentFilter].length,
    );

    if (result.success && result.data) {
      const allItems = [
        ...searchResults[currentFilter],
        ...result.data[currentFilter],
      ];
      const uniqueItems = Array.from(
        new Map(allItems.map((item) => [item.id, item])).values(),
      );

      setSearchResults({
        ...searchResults,
        [currentFilter]: uniqueItems,
      });
    }
  };

  const sentinelRef = useLoadMoreTracksOnScroll(handleLoadMore);

  if (!searchResults) return null;

  return (
    <SearchResultSection>
      {searchResults[currentFilter]?.map((item) => (
        <GenericCard key={item.id} imageUrl={item.imageUrl} name={item.name} />
      ))}
      <div ref={sentinelRef} style={{ height: "10px", background: "red" }} />
    </SearchResultSection>
  );
}

export default FPFiltered;
