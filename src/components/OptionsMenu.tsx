import useHoverTrackItem from "../hooks/useHoverTrackItem";

interface OptionsMenuProps {
  options: string[];
  ref: React.RefObject<HTMLUListElement>;
  areOptionsVisible: boolean;
}

function OptionsMenu({ ref, areOptionsVisible, options }: OptionsMenuProps) {
  const { handleMouseEnter, handleMouseLeave } = useHoverTrackItem();

  const handleDisplayOptions = () => {
    areOptionsVisible = true;
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleDisplayOptions}
      className="relative justify-self-end"
    >
      <ul
        ref={ref}
        className={`absolute -right-4 bottom-7 z-10 rounded-md bg-amber-200 p-1 text-xs text-nowrap shadow-md ${areOptionsVisible ? "inline" : "hidden"}`}
      >
        {options.map((option) => (
          <li key={option}>{option}</li>
        ))}
      </ul>
    </div>
  );
}

export default OptionsMenu;
