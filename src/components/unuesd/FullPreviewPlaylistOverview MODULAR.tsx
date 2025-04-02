import { getPlaylistLenght } from "../../features/playlists/playlistHelpers";
import { useStateStore } from "../../state/store";
import FullPreviewOverview from "./FullPreviewOverview MODULAR";
import UserAvatar from "../UserAvatar";
import { DetailedPlaylistType } from "../../features/playlists/playlists";

interface FullPreviewPlaylistOverviewProps {
  data: DetailedPlaylistType;
}

function FullPreviewPlaylistOverview({
  data,
}: FullPreviewPlaylistOverviewProps) {
  const currentUserID = useStateStore((store) => store.user?.userID);
  const currUserOwnsPlaylist = Boolean(data.ownerId === currentUserID);

  const additionalInfo = (
    <>
      {currUserOwnsPlaylist && <UserAvatar />}
      <span className="underline-offset-1 hover:cursor-pointer hover:underline">
        {getPlaylistLenght(data)}
      </span>
    </>
  );

  return (
    <FullPreviewOverview
      imageUrl={data.imageUrl}
      name={data.name}
      ownerName={data.ownerName}
      type={data.type}
      additionalInfo={additionalInfo}
    />
  );
}

export default FullPreviewPlaylistOverview;
