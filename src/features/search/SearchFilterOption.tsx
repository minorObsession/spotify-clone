import { SearchFiltersType } from "./search";

interface SearchFilterOptionProps {
  filterBy: string;
  isActive: boolean;
  handleClick: (filterBy: SearchFiltersType) => void;
}

// Function to convert filter values to display text
const getFilterDisplayText = (filterBy: string): string => {
  switch (filterBy) {
    case "track,artist,album,playlist,show,episode,audiobook":
      return "All";
    case "track":
      return "Tracks";
    case "artist":
      return "Artists";
    case "album":
      return "Albums";
    case "playlist":
      return "Playlists";
    case "podcast":
      return "Podcasts";
    case "episode":
      return "Episodes";
    case "audiobook":
      return "Audiobooks";
    default:
      return filterBy;
  }
};

function SearchFilterOption({
  filterBy,
  isActive,
  handleClick,
}: SearchFilterOptionProps) {
  return (
    <p
      className={`cursor-pointer rounded-full px-3 py-1 bg-amber-${isActive ? 600 : 300}`}
      onClick={() => handleClick(filterBy as SearchFiltersType)}
    >
      {getFilterDisplayText(filterBy)}
    </p>
  );
}

export default SearchFilterOption;
