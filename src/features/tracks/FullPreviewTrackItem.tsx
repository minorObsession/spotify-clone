import { memo, useState } from "react";
import { flexibleMillisecondsConverter } from "../../helpers/helperFunctions";
import { SlOptions } from "react-icons/sl";
import Thumbnail from "../../components/Thumbnail";
import { useScreenWidthRem } from "../../hooks/useScreenWidthRem";
import { useNavigate } from "react-router";
import useOutsideClick from "../../hooks/useOutsideClick";

interface TrackProps {
  track: Record<string, any>;
  index: number;
}

// ! REFACTOR MENU STUFF IN SEPERATE COMPONENT
function FullPreviewTrackItem({ track, index }: TrackProps) {
  const navigate = useNavigate();
  const { screenWidth: screenWidthRem } = useScreenWidthRem();

  const [isTrackHovered, setIsTrackHovered] = useState(false);
  const [areOptionsHovered, setAreOptionsHovered] = useState(false);
  const [areOptionsVisible, setAreOptionsVisible] = useState(false);
  const [isTrackBoxSelected, setIsTrackBoxSelected] = useState(false);

  const menuRef = useOutsideClick(setAreOptionsVisible, setIsTrackBoxSelected);

  const artists: [] = track.artists.map(
    (artist: Record<string, any>) => artist.name,
  );
  const artistsToDisplay = artists.map((artist, i) =>
    i + 1 === artists.length ? artist : `${artist}, `,
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

  const handleDisplayTrackOptions = () => {
    setAreOptionsHovered(false);
    setAreOptionsVisible(true);

    // ! do stuff...
  };

  const handleTrackSelect = (e: React.MouseEvent) => {
    console.log(e);
    navigate(`/home/track/${e.target.id}`);
  };

  return (
    <div
      onMouseEnter={() => setIsTrackHovered(true)}
      onMouseLeave={() => setIsTrackHovered(false)}
      onClick={() => setIsTrackBoxSelected(true)}
      className={`playlist-row text:xs ${!isTrackBoxSelected && "hover:bg-amber-400"} ${isTrackBoxSelected && "bg-amber-700"} lg:text-lg`}
    >
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
          <span className="underline-offset-1 hover:cursor-pointer hover:underline">
            {artistsToDisplay}
          </span>
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

      {/* <TrackOptions/> */}
      {/* // ! options div */}
      <div
        onMouseEnter={() => !areOptionsVisible && setAreOptionsHovered(true)}
        onMouseLeave={() => setAreOptionsHovered(false)}
        onClick={handleDisplayTrackOptions}
        className="relative justify-self-end"
      >
        {/* // ! options hover */}
        <span
          className={`absolute -right-4 bottom-7 z-12 rounded-md bg-amber-200 p-1 text-xs text-nowrap shadow-md ${areOptionsHovered ? "inline" : "hidden"}`}
        >
          see more options for {track.name} by {artistsToDisplay}
        </span>
        {/* // ! options menu */}
        <ul
          ref={menuRef}
          className={`absolute -right-4 bottom-7 z-10 rounded-md bg-amber-200 p-1 text-xs text-nowrap shadow-md ${areOptionsVisible ? "inline" : "hidden"}`}
        >
          <li>Add to playlist &rarr;</li>
          <li>Save to your Liked Songs</li>
          <li>Add to queue</li>
          <li>Go to artist</li>
          <li>Go to album</li>
          <li>View credits</li>
          <li>Share &rarr;</li>
          <li>opt5</li>
        </ul>

        {/* // ! dots to display menu  */}
        <span className="justify-self-start hover:cursor-pointer">
          {(isTrackHovered && !areOptionsVisible) || isTrackBoxSelected ? (
            <SlOptions />
          ) : (
            ""
          )}
        </span>
      </div>
    </div>
  );
}

export default memo(FullPreviewTrackItem);
