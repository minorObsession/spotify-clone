import { getPlaylistLenght } from "../features/playlists/playlistHelpers";
import { useStateStore } from "../state/store";
import { TrackType } from "../features/tracks/track";
import Thumbnail from "./Thumbnail";
import UserAvatar from "./UserAvatar";
import { DetailedPlaylistType } from "../features/playlists/playlists";

interface FullPreviewOverviewProps {
  data: DetailedPlaylistType | TrackType;
}

function FullPreviewOverview({ data }: FullPreviewOverviewProps) {
  // ✅ Type guard for Playlist
  const isPlaylist = (
    data: DetailedPlaylistType | TrackType,
  ): data is DetailedPlaylistType => {
    return "tracks" in data; // Playlists have a `tracks` property, tracks don't
  };
  // ✅ Type guard for Track
  const isTrack = (
    data: DetailedPlaylistType | TrackType,
  ): data is TrackType => {
    return "trackId" in data;
  };
  const getDataType = (data: DetailedPlaylistType | TrackType) => {
    if (isPlaylist(data)) return "playlist";
    if (isTrack(data)) return "track";
    return "unknown";
  };

  const currentUserID = useStateStore((store) => store.user?.userID);
  const currUserOwnsPlaylist = Boolean(
    isPlaylist(data) && data.ownerId === currentUserID,
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
            {(isPlaylist(data) && data.ownerName) ||
              (isTrack(data) && data.artists[0])}
          </span>
          {/* // ! ALBUM + RELEASE date - (only for tracks** )  */}
          {isTrack(data) && (
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
            {(isPlaylist(data) && getPlaylistLenght(data)) ||
              (isTrack(data) && data.trackDuration)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default FullPreviewOverview;
