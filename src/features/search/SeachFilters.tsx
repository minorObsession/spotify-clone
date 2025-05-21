import { useState } from "react";
import SearchFilterOption from "./SearchFilterOption";
import { useStateStore } from "../../state/store";
import { SearchFilters } from "./search";

function SearchFilterBar() {
  const { searchFilters, setSearchFilters } = useStateStore((store) => store);
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="flex gap-2 pb-5">
      {searchFilters.map((filter: SearchFilters) => (
        <SearchFilterOption
          key={filter}
          filterBy={filter}
          isActive={filter === activeFilter}
          handleClick={setActiveFilter}
        />
      ))}
    </div>
  );
}

export default SearchFilterBar;
