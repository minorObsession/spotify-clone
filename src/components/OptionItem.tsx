import { MenuFor } from "./OptionsMenu";
import { useStateStore } from "../state/store";

interface OptionItemProps {
  option: string;
  menuFor: MenuFor;
}

function OptionItem({ option, menuFor }: OptionItemProps) {
  const { logout } = useStateStore((store) => store);

  const handleOptionClick = (clickedOption: string) => {
    if (menuFor === "userAvatar") logout();

    if (menuFor === "playlist") {
      if (clickedOption === "Edit details") {
        // ! open modal
      }
    }

    if (menuFor === "addToPlaylist") {
      if (clickedOption === "Edit details") {
        // ! open modal
      }
    }

    if (menuFor === "track") {
      if (clickedOption === "Add to playlist") {
        // ! open modal
      }
    }
  };

  return (
    <li
      onClick={() => handleOptionClick(option)}
      key={option}
      className={`w-fit hover:cursor-pointer hover:underline`}
    >
      {option}
    </li>
  );
}

export default OptionItem;
