import { memo } from "react";
import { flexibleMillisecondsConverter } from "../helpers/helperFunctions";
import { SlOptions } from "react-icons/sl";
import Thumbnail from "./Thumbnail";
import { useScreenWidthRem } from "../hooks/useScreenWidthRem";

interface TrackProps {
  track: Record<string, any>;
  index: number;
}

function FullPreviewTrack({ track, index }: TrackProps) {
  const { screenWidth: screenWidthRem } = useScreenWidthRem();

  console.log(track);

  const artists = track.artists.reduce(
    (acc: string, artist: Record<string, any>, i, array) => {
      let artistNamePlus = artist.name + ", ";

      if (i + 1 === array.length)
        artistNamePlus = artistNamePlus.replace(",", "");

      acc += artistNamePlus;
      return acc;
    },
    "",
  );
  const album = track.album.name;

  const playbackTime = track.duration_ms;

  const timeToDisplay = flexibleMillisecondsConverter(playbackTime)
    .split("min")
    .map((el, i) => {
      if (i === 0) return el + ":";
      if (i === 1) {
        const sec = el.replace("s", "").trim();
        if (+sec - 10 < 0) {
          const fixed = sec.padStart(2, "0");
          return fixed;
        }
        return sec;
      }
      return el;
    });

  const thumbnailUrl = track.album.images[0].url;

  return (
    <div className="playlist-row text-2xs">
      <div className="grid grid-cols-[1fr_5fr] grid-rows-[1fr_1fr] items-center gap-x-2.5 truncate p-1 sm:grid-cols-[1fr_5fr] md:grid-cols-[1fr_7fr] md:p-1.5 lg:gap-x-2">
        {/* // ! number + thumbnail   */}
        <div className="row-span-2 flex items-center gap-2 lg:gap-3">
          <span>{index}</span>
          <Thumbnail
            additionalClasses="w-7 md:w-7.5 lg:w-10"
            img={thumbnailUrl}
          />
        </div>
        {/* // ! TRACK name */}
        <p className="truncate" key={track.name}>
          {track.name}
        </p>
        <p className="text-2xs truncate">{artists}</p>
      </div>

      {screenWidthRem > 64 && <p className="truncate">{album}</p>}
      {screenWidthRem > 102 && <p className="truncate">date</p>}

      {/* // !  */}
      <div className="flex items-center gap-1.5 justify-self-end lg:gap-3">
        <p className="">{timeToDisplay}</p>
        {/* // ! only when hovered */}
        <span>
          <SlOptions />
        </span>
      </div>
    </div>
  );
}

export default memo(FullPreviewTrack);
