import SearchResultSection from "../../components/SearchResultSection";
import { useLoadMoreTracksOnScroll } from "../../hooks/useLoadMoreTracksOnScroll";
import { useStateStore } from "../../state/store";
import GenericCard from "../../components/GenericCard";

// ! GOTTA MATCH TYPES HERE WITH SEARCH FILTERS TYPE
// ! GOTTA MATCH TYPES HERE WITH SEARCH FILTERS TYPE
// ! GOTTA MATCH TYPES HERE WITH SEARCH FILTERS TYPE
// ! GOTTA MATCH TYPES HERE WITH SEARCH FILTERS TYPE
// ! GOTTA MATCH TYPES HERE WITH SEARCH FILTERS TYPE
// ! GOTTA MATCH TYPES HERE WITH SEARCH FILTERS TYPE
interface FPFilteredProps {
  filter:
    | "artists"
    | "albums"
    | "playlists"
    | "podcasts"
    | "episodes"
    | "audiobooks";
}

function FPFiltered({ filter }: FPFilteredProps) {
  const { search, setSearchResults, searchResults } = useStateStore();

  const handleLoadMore = async () => {
    if (!searchResults) return;

    const result = await search(
      searchResults.searchQuery,
      searchResults[filter].length,
    );
    if (result.success && result.data) {
      // Combine existing and new artists, then deduplicate by ID
      const allItems = [...searchResults[filter], ...result.data[filter]];
      const uniqueItems = Array.from(
        new Map(allItems.map((item) => [item.id, item])).values(),
      );

      setSearchResults({
        ...searchResults,
        [filter]: uniqueItems,
      });
    }
  };

  const sentinelRef = useLoadMoreTracksOnScroll(handleLoadMore);

  if (!searchResults) return null;

  return (
    <SearchResultSection>
      {searchResults[filter].map((item) => (
        <GenericCard key={item.id} imageUrl={item.imageUrl} name={item.name} />
      ))}
      <div ref={sentinelRef} style={{ height: "10px", background: "red" }} />
    </SearchResultSection>
  );
}

export default FPFiltered;
