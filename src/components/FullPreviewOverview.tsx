import { DetailedPlaylistType } from "../state/playlists";
import { useStateStore } from "../state/store";
import Thumbnail from "./Thumbnail";
import UserAvatar from "./UserAvatar";

interface FullPreviewOverviewProps {
  data: DetailedPlaylistType;
}

function FullPreviewOverview({ data }: FullPreviewOverviewProps) {
  console.log(data);
  const currentUserID = useStateStore((store) => store.user?.userID);

  // // ! getting artist form each track
  // data.tracks.items.forEach((item: any) => {
  //   item.track?.artists.forEach((artist: any) => {
  //     artistsSet.add(artist.name);
  //   });
  // });

  // avatar find
  const currUserOwnsPlaylist = Boolean(
    currentUserID && data.ownerId === currentUserID,
  );

  return (
    // {/* // ! image and title */}
    <div className="flex gap-3 border-b-2 py-4">
      {/* // ! Image */}
      <div className="aspect-square flex-[0_1_20%]">
        <Thumbnail
          img={data.imageUrl}
          width="w-full"
          additionalClasses="w-full h-full object-contain"
        />
      </div>

      {/* // ! Playlist Info Div */}
      <div className="grid items-center md:text-lg lg:text-xl">
        <h5 className="">{data.type}</h5>
        <h1 className="text-xl font-bold sm:text-3xl md:text-4xl lg:w-[12ch] lg:whitespace-pre-wrap">
          {data.name}
        </h1>
        {/* // ! user div */}
        <div className="flex items-center gap-1">
          {currUserOwnsPlaylist && <UserAvatar />}
          <span>{data.ownerName}</span>
          <span>length</span>
        </div>
      </div>
    </div>
  );
}

export default FullPreviewOverview;
