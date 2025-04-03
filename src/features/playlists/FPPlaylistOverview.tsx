import { getPlaylistLenght } from "./playlistHelpers";
import { useStateStore } from "../../state/store";
import UserAvatar from "../../components/UserAvatar";
import { DetailedPlaylistType } from "./playlists";
import FullPreviewThumbnail from "../../components/FPOverviewThumbnail";

interface FullPreviewPlaylistOverviewProps {
  data: DetailedPlaylistType;
}

function FullPreviewPlaylistOverview({
  data,
}: FullPreviewPlaylistOverviewProps) {
  const currentUserID = useStateStore((store) => store.user?.userID);
  const currUserOwnsPlaylist = Boolean(data.ownerId === currentUserID);

  return (
    // {/* // ! image and title */}
    <article className="flex gap-3 border-b-2 py-4">
      {/* // ! Image */}
      <FullPreviewThumbnail imageUrl={data.imageUrl} />
      {/* // ! Playlist Info Div */}
      <div className="grid items-center md:text-lg lg:text-xl">
        <h5 className="">{data.type}</h5>
        <h1 className="text-xl font-bold sm:text-3xl md:text-4xl lg:w-[12ch] lg:whitespace-pre-wrap">
          {data.name}
        </h1>
        {/* // ! DYNAMICALLY IMPORT PHOTO based on ID */}
        <div className="flex items-center gap-1">
          {(currUserOwnsPlaylist && <UserAvatar />) || "placeholderIMG"}

          {/* // ! NAME of Playlist/Artist  */}
          <span className="underline-offset-1 hover:cursor-pointer hover:underline">
            {data.ownerName}
          </span>

          {/* // ! LENGTH of Playlist */}
          <span className="underline-offset-1 hover:cursor-pointer hover:underline">
            {getPlaylistLenght(data.tracks)}
          </span>
        </div>
      </div>
    </article>
  );
}

export default FullPreviewPlaylistOverview;
