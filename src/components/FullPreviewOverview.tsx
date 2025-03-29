import { getPlaylistLenght } from "../features/playlists/playlistHelpers";
import { useStateStore } from "../state/store";
import { TrackType } from "../features/tracks/track";
import Thumbnail from "./Thumbnail";
import UserAvatar from "./UserAvatar";
import { DetailedPlaylistType } from "../features/playlists/playlists";
import {
  getDataType,
  isDataTrack,
  isDataPlaylist,
} from "../features/tracks/tracksHelpers";

interface FullPreviewOverviewProps {
  data: DetailedPlaylistType | TrackType;
}

function FullPreviewOverview({ data }: FullPreviewOverviewProps) {
  const isPlaylist = isDataPlaylist(data);
  const isTrack = isDataTrack(data);

  const currentUserID = useStateStore((store) => store.user?.userID);
  const currUserOwnsPlaylist = Boolean(
    isPlaylist && data.ownerId === currentUserID,
  );

  if (getDataType(data) === "unknown") return null;

  return (
    // {/* // ! image and title */}
    <div className="flex gap-3 border-b-2 py-4">
      {/* // ! Image */}
      <div className="aspect-square flex-[0_1_20%]">
        <Thumbnail
          img={data.imageUrl}
          minWidth="w-full"
          additionalClasses="w-full h-full object-contain"
        />
      </div>

      {/* // ! Playlist/Track Info Div */}
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
            {(isPlaylist && data.ownerName) || (isTrack && data.artists[0])}
          </span>
          {/* // ! ALBUM + RELEASE date - (only for tracks** )  */}
          {isTrack && (
            <>
              <span className="underline-offset-1 hover:cursor-pointer hover:underline">
                {data.albumName}
              </span>
              {/* // * on hover - show full release date */}
              <span className="underline-offset-1 hover:cursor-pointer hover:underline">
                {new Date(data.releaseDate).getFullYear()}
              </span>
            </>
          )}
          {/* // ! LENGTH of Playlist/Track */}
          <span className="underline-offset-1 hover:cursor-pointer hover:underline">
            {(isPlaylist && getPlaylistLenght(data)) ||
              (isTrack && data.trackDuration)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default FullPreviewOverview;
