import { memo } from "react";
import { flexibleMillisecondsConverter } from "../helpers/helperFunctions";
import { SlOptions } from "react-icons/sl";
import Thumbnail from "./Thumbnail";
import { useScreenWidthRem } from "../hooks/useScreenWidthRem";
import { useNavigate } from "react-router";

interface TrackProps {
  track: Record<string, any>;
  index: number;
}

function FullPreviewTrackItem({ track, index }: TrackProps) {
  const { screenWidth: screenWidthRem } = useScreenWidthRem();
  const navigate = useNavigate();

  const artists: [] = track.artists.map(
    (artist: Record<string, any>) => artist.name,
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

  const handleTrackSelect = (e) => {
    console.log(e);
    navigate(`/home/track/${e.target.id}`);
  };

  return (
    <div className="playlist-row text:xs hover:bg-amber-400 lg:text-lg">
      <div className="playlist-item truncate p-1">
        {/* // ! number + thumbnail   */}
        <div className="row-span-2 flex items-center gap-2 lg:gap-3">
          <span>{index}</span>
          <Thumbnail
            additionalClasses="w-7 md:w-7.5 lg:w-8.5"
            img={thumbnailUrl}
          />
        </div>
        {/* // ! TRACK name */}
        <span
          onClick={handleTrackSelect}
          id={track.id}
          className="w-fit truncate underline-offset-1 hover:cursor-pointer hover:underline"
          key={track.id}
        >
          {track.name}
        </span>
        <span className="text-2xs w-fit truncate md:text-sm lg:text-sm">
          {artists.map((artist, i) => (
            <span
              key={i}
              className="underline-offset-1 hover:cursor-pointer hover:underline"
            >
              {i + 1 === artists.length ? artist : `${artist}, `}
            </span>
          ))}
        </span>
      </div>

      {screenWidthRem > 64 && (
        <p className="truncate underline-offset-1 hover:cursor-pointer hover:underline">
          {album}
        </p>
      )}

      {screenWidthRem > 102 && <p className="truncate">date</p>}

      {/* // ! DURATION */}

      <p className="text-right">{timeToDisplay}</p>
      {/* // ! only when hovered */}

      {/* // ! replace true with isHovered */}
      {/* // ! add full desc on  hover */}
      <span className="justify-self-end hover:cursor-pointer">
        {false ? "" : <SlOptions />}
      </span>
    </div>
  );
}

export default memo(FullPreviewTrackItem);
