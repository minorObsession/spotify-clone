import { useScreenWidthRem } from "../../hooks/useScreenWidthRem";
import UserAvatar from "../../components/UserAvatar";

// ! ONLY FOR MOBILE VIEW
function MobileHeader() {
  const { isLargeScreen } = useScreenWidthRem();

  if (isLargeScreen) return null;

  return (
    <menu className={`flex items-center bg-amber-500`}>
      <UserAvatar inHeader={true} />
    </menu>
  );
}

export default MobileHeader;
