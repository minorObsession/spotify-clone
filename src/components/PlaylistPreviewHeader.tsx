import { useScreenWidthRem } from "../hooks/useScreenWidthRem";

function PlaylistPreviewHeader() {
  const { screenWidth: screenWidthRem } = useScreenWidthRem();

  return (
    <div className="playlist-row text-2xs">
      <div className="flex gap-2 px-1 lg:gap-3 lg:px-1 lg:py-0.5">
        <span>#</span>
        <span>title</span>
      </div>
      {screenWidthRem > 64 && <p className="truncate">Album</p>}
      {screenWidthRem > 102 && <p className="truncate">Date Added</p>}
      <p className="justify-self-end">one</p>
    </div>
  );
}

export default PlaylistPreviewHeader;
// px - 2;
// px - 3;
