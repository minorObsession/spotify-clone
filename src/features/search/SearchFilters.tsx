import { useState } from "react";
import SearchFilterOption from "./SearchFilterOption";
import { useStateStore } from "../../state/store";

const filterMap = {
  All: "track,artist,album,playlist,show,episode,audiobook",
  Tracks: "track",
  Artists: "artist",
  Albums: "album",
  Playlists: "playlist",
  Podcasts: "podcast",
  Episodes: "episode",
  Audiobooks: "audiobook",
} as const;

export type FilterKey = keyof typeof filterMap;
const filterOptions = Object.keys(filterMap) as FilterKey[];

function SearchFilters() {
  const { setSearchFilters } = useStateStore((store) => store);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All");

  const handleFilterClick = (filter: FilterKey) => {
    setActiveFilter(filter);
    setSearchFilters(filterMap[filter]);
  };

  return (
    <div className="flex gap-2 pb-5">
      {filterOptions.map((filter) => (
        <SearchFilterOption
          key={filter}
          filterBy={filter}
          isActive={filter === activeFilter}
          handleClick={handleFilterClick}
        />
      ))}
    </div>
  );
}

export default SearchFilters;
