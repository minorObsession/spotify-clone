import { SlHome, SlMagnifier, SlPlus } from "react-icons/sl";
import { VscLibrary } from "react-icons/vsc";

function MobileNav() {
  return (
    <menu
      className={`grid-nav-m bottom-0 flex h-10 items-center justify-center gap-5 border-2 p-1.5 text-sm`}
    >
      <SlHome fill="red" size={20} className="" />
      <SlMagnifier fill="red" size={20} />
      <VscLibrary fill="red" size={20} />
      <SlPlus fill="red" size={20} />
    </menu>
  );
}

export default MobileNav;
