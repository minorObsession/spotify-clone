import { getPlaylistLength } from "./playlistHelpers";
import { useStateStore } from "../../state/store";
import UserAvatar from "../../components/UserAvatar";
import { DetailedPlaylistType } from "./playlists";
import FullPreviewThumbnail from "../../components/FPOverviewThumbnail";

import { PartialPlaylist } from "../../components/EditPlaylistModal";
import { useEditPlaylistModal } from "../../hooks/useEditPlaylistModal";

interface FPPlaylistOverviewProps {
  playlist: DetailedPlaylistType;
}

function FPPlaylistOverview({
  playlist,
  // refetchPlaylist,
}: FPPlaylistOverviewProps) {
  const currentUserID = useStateStore((store) => store.user?.userID);
  const currUserOwnsPlaylist = Boolean(playlist.ownerId === currentUserID);
  const { openEditModal, EditPlaylistModalPortal } = useEditPlaylistModal();
  return (
    // {/* // ! image and title */}
    <article
      className="flex gap-3 border-b-2 bg-red-600 py-4"
      data-playlist-id={playlist.id}
      onClick={() => openEditModal(playlist as PartialPlaylist)}
    >
      {/* // ! edit playlist modal */}
      <EditPlaylistModalPortal />
      {/* // ! Playlist Image */}
      <FullPreviewThumbnail imageUrl={playlist.imageUrl} />
      {/* // ! Playlist Info Div */}
      <div className="grid items-center md:text-lg lg:text-xl">
        <h5 className="">{playlist.type}</h5>
        <h1 className="text-xl font-bold sm:text-3xl md:text-4xl lg:w-[12ch] lg:whitespace-pre-wrap">
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
            {getPlaylistLength(playlist.tracks)}
          </span>
        </div>
      </div>
    </article>
  );
}

export default FPPlaylistOverview;
