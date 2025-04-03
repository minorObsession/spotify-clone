import { TrackType } from "./track";
import FullPreviewThumbnail from "../../components/FPOverviewThumbnail";
import { flexibleMillisecondsConverter } from "../../helpers/helperFunctions";

interface FullPreviewTrackOverviewProps {
  data: TrackType;
}

function FullPreviewTrackOverview({ data }: FullPreviewTrackOverviewProps) {
  //

  return (
    // {/* // ! image and title */}

    <article className="flex gap-3 border-b-2 py-4">
      {/* // ! Image */}
      <FullPreviewThumbnail imageUrl={data.imageUrl} />

      {/* // ! Playlist/Track Info Div */}
      <div className="grid items-center md:text-lg lg:text-xl">
        <h5 className="">{data.type}</h5>
        <h1 className="text-xl font-bold sm:text-3xl md:text-4xl lg:w-[12ch] lg:whitespace-pre-wrap">
          {data.name}
        </h1>
        {/* // ! DYNAMICALLY IMPORT PHOTO based on ID */}
        <div className="flex items-center gap-1">
          {/* // * FIND PLAYLIST OWNER PHOTO!! */}
          {"placeholderIMG"}

          {/* // ! NAME of Artist  */}
          <span className="underline-offset-1 hover:cursor-pointer hover:underline">
            {/* // render first artist */}
            {data.artists.map((artist, i) => i === 0 && artist.name)}
          </span>
          {/* // ! ALBUM + RELEASE date - */}
          <>
            <span className="underline-offset-1 hover:cursor-pointer hover:underline">
              {data.albumName}
            </span>
            {/* // * on hover - show full release date */}
            <span className="underline-offset-1 hover:cursor-pointer hover:underline">
              {new Date(data.releaseDate).getFullYear()}
            </span>
          </>
          {/* // ! LENGTH of Track */}
          <span className="underline-offset-1 hover:cursor-pointer hover:underline">
            {flexibleMillisecondsConverter(data.trackDuration)}
          </span>
        </div>
      </div>
    </article>
  );
}

export default FullPreviewTrackOverview;
