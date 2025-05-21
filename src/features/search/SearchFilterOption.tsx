import { FilterKey } from "./SearchFilters";

interface SearchFilterOptionProps {
  filterBy: string;
  isActive: boolean;
  handleClick: (filter: FilterKey) => void;
}

function SearchFilterOption({
  filterBy,
  handleClick,
  isActive,
}: SearchFilterOptionProps) {
  return (
    <p
      className={`cursor-pointer rounded-full px-3 py-1 bg-amber-${isActive ? 600 : 300}`}
      onClick={() => handleClick(filterBy as FilterKey)}
    >
      {filterBy}
    </p>
  );
}

export default SearchFilterOption;
