import { useRef } from "react";
import { useStateStore } from "../state/store";
import OptionsMenu from "./OptionsMenu";

function UserAvatar() {
  const userPhoto = useStateStore((store) => store.user && store.user.photo);
  // const menuRef = useRef<HTMLImageElement | null>(null);
  // * maybe a login btn instead of null
  if (!userPhoto) return null;

  return (
    <>
      <img src={userPhoto} alt="user avatar" className={`w-8 rounded-2xl`} />
      {/* // ! menu    */}
      {/* <OptionsMenu
        ref={menuRef}
        areOptionsVisible={areOptionsVisible}
        options={options}
        directionOfMenu="bottomLeft"
      /> */}
    </>
  );
}

export default UserAvatar;
