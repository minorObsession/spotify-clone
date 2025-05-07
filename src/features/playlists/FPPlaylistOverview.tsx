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
  refreshPlaylist: () => Promise<void>;
}

function FPPlaylistOverview({
  playlist,
  refreshPlaylist,
}: FPPlaylistOverviewProps) {
  const currentUserID = useStateStore((store) => store.user?.userID);
  const currUserOwnsPlaylist = Boolean(playlist.ownerId === currentUserID);
  const [isEditingPlaylist, setIsEditingPlaylist] = useState(true);

  return (
    // {/* // ! image and title */}
    <article className="flex gap-3 border-b-2 py-4">
      {/* // ! edit playlist modal */}
      {isEditingPlaylist &&
        createPortal(
          <EditPlaylistModal
            playlist={playlist}
            refreshPlaylist={refreshPlaylist}
            setIsEditingPlaylist={setIsEditingPlaylist}
            isEditingPlaylist={isEditingPlaylist}
          />,
          document.getElementById("root")!,
        )}
      {/* // ! Playlist Image */}
      <FullPreviewThumbnail imageUrl={playlist.imageUrl} />
      {/* // ! Playlist Info Div */}
      <div className="grid items-center md:text-lg lg:text-xl">
        <h5 className="">{playlist.type}</h5>
        <h1
          onClick={() => setIsEditingPlaylist(true)}
          className="text-xl font-bold sm:text-3xl md:text-4xl lg:w-[12ch] lg:whitespace-pre-wrap"
        >
          {playlist.name}
        </h1>
        {/* // ! User photo */}
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
