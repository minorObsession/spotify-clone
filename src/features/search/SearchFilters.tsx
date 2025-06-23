import { useState } from "react";
import SearchFilterOption from "./SearchFilterOption";
import { useStateStore } from "../../state/store";
import { SearchFiltersType } from "./search";

function SearchFilters() {
  const { searchFilter, setSearchFilters } = useStateStore((store) => store);
  const [activeFilter, setActiveFilter] =
    useState<SearchFiltersType>(searchFilter);

  const handleFilterClick = (filterOption: SearchFiltersType) => {
    setActiveFilter(filterOption);
    setSearchFilters(filterOption);
  };

  const filterOptions: SearchFiltersType[] = [
    "track,artist,album,playlist,show,episode,audiobook",
    "track",
    "artist",
    "album",
    "playlist",
    "podcast",
    "episode",
    "audiobook",
  ];

  return (
    <div className="flex gap-2 pb-5">
      {filterOptions.map((filterOption) => (
        <SearchFilterOption
          key={filterOption}
          filterBy={filterOption}
          isActive={filterOption === activeFilter}
          handleClick={handleFilterClick}
        />
      ))}
    </div>
  );
}

export default SearchFilters;
