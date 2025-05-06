import { getPlaylistLenght } from "./playlistHelpers";
import { useStateStore } from "../../state/store";
import UserAvatar from "../../components/UserAvatar";
import { DetailedPlaylistType } from "./playlists";
import FullPreviewThumbnail from "../../components/FPOverviewThumbnail";
import { useState } from "react";
import EditPlaylistModal from "../../components/EditPlaylistModal";
import { createPortal } from "react-dom";

interface FPPlaylistOverviewProps {
  playlist: DetailedPlaylistType;
}

function FPPlaylistOverview({ playlist }: FPPlaylistOverviewProps) {
  const currentUserID = useStateStore((store) => store.user?.userID);
  const currUserOwnsPlaylist = Boolean(playlist.ownerId === currentUserID);
  const [isEditingPlaylist, setIsEditingPlaylist] = useState(true);

  const handleEditPlaylist = () => {
    setIsEditingPlaylist((prev) => !prev);
  };

  return (
    // {/* // ! image and title */}
    <article className="flex gap-3 border-b-2 py-4">
      {isEditingPlaylist &&
        createPortal(
          <EditPlaylistModal
            playlist={playlist}
            setIsEditingPlaylist={setIsEditingPlaylist}
            isEditingPlaylist={isEditingPlaylist}
          />,
          document.getElementById("root")!,
        )}
      {/* // ! Image */}
      <FullPreviewThumbnail imageUrl={playlist.imageUrl} />
      {/* // ! Playlist Info Div */}
      <div className="grid items-center md:text-lg lg:text-xl">
        <h5 className="">{playlist.type}</h5>
        <h1 className="text-xl font-bold sm:text-3xl md:text-4xl lg:w-[12ch] lg:whitespace-pre-wrap">
          {playlist.name}
        </h1>
        {/* // ! DYNAMICALLY IMPORT PHOTO based on ID */}
        <div className="flex items-center gap-1">
          {(currUserOwnsPlaylist && <UserAvatar />) || "placeholderIMG"}

          {/* // ! NAME of Playlist/Artist  */}
          <span className="underline-offset-1 hover:cursor-pointer hover:underline">
            {playlist.ownerName}
          </span>

          {/* // ! LENGTH of Playlist */}
          <span className="underline-offset-1 hover:cursor-pointer hover:underline">
            {getPlaylistLenght(playlist.tracks)}
          </span>
        </div>
      </div>
    </article>
  );
}

export default FPPlaylistOverview;
