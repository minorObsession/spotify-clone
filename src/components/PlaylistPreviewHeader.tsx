import { useScreenWidthRem } from "../hooks/useScreenWidthRem";
import { MdAccessTime } from "react-icons/md";

function PlaylistPreviewHeader() {
  const { screenWidth: screenWidthRem } = useScreenWidthRem();

  return (
    <div className="playlist-row text-2xs border-none">
      <div className="flex gap-2 px-1 lg:gap-3 lg:px-1 lg:py-0.5">
        <span>#</span>
        <span>Title</span>
      </div>
      {screenWidthRem > 64 && <p className="truncate">Album</p>}
      {screenWidthRem > 102 && <p className="truncate">Date Added</p>}
      <span className="justify-self-end">
        <MdAccessTime size={14} />
      </span>
      <span className="justify-self-end"></span>
    </div>
  );
}

export default PlaylistPreviewHeader;
