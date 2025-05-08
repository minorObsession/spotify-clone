import { useState } from "react";
import { useStateStore } from "../state/store";
import OptionsMenu from "./OptionsMenu";
import useOutsideClick from "../hooks/useOutsideClick";
import Tooltip from "./Tooltip";
import useHoverTrackItem from "../hooks/useHoverTrackItem";

interface UserAvatarProps {
  inHeader?: boolean;
}

function UserAvatar({ inHeader = false }: UserAvatarProps) {
  const user = useStateStore((store) => store.user);
  const userPhoto = useStateStore((store) => store.user && store.user.photo);
  const [areOptionsVisible, setAreOptionsVisible] = useState(false);
  const { isHovered, handleMouseEnter, handleMouseLeave } = useHoverTrackItem();
  const menuRef = useOutsideClick<HTMLUListElement>(
    setAreOptionsVisible,
  ) as React.RefObject<HTMLUListElement>;

  const options = ["Log out"];

  // * maybe a login btn instead of null
  if (!userPhoto) return null;

  return (
    <div className="relative self-end">
      <img
        src={userPhoto}
        alt="user avatar"
        onClick={() => setAreOptionsVisible((s) => !s)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`w-8 rounded-2xl`}
      />
      {/* // ! menu    */}
      {inHeader && (
        <>
          <Tooltip
            message={`See more options for ${user?.username}`}
            isVisible={!areOptionsVisible && isHovered}
            directionOfMenu="bottomLeft"
          />
          <OptionsMenu
            menuFor="userAvatar"
            ref={menuRef}
            areOptionsVisible={areOptionsVisible}
            options={options}
            directionOfMenu="bottomLeft"
          />
        </>
      )}
    </div>
  );
}

export default UserAvatar;
