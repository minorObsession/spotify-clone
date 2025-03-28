import { useScreenWidthRem } from "../../hooks/useScreenWidthRem";

function MobileHeaderTabs() {
  const { isLargeScreen } = useScreenWidthRem();

  if (isLargeScreen) return null;

  return (
    <nav className="flex gap-2 p-2">
      <li>all</li>
      <li>music</li>
      <li>audiobooks</li>
    </nav>
  );
}

export default MobileHeaderTabs;
