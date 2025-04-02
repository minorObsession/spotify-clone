import { memo, useState } from "react";
import { flexibleMillisecondsConverter } from "../../helpers/helperFunctions";
import Thumbnail from "../../components/Thumbnail";
import { useScreenWidthRem } from "../../hooks/useScreenWidthRem";
import { useNavigate } from "react-router";
import TrackOptions from "./TrackOptions";

interface TrackProps {
  // * PROBABLY THE BEST IDEA IS TO NOT USE ANY AND TO INSTEAD FILL TrackType with everything it needs right in zustaand fetch!!!!
  track: Record<string, any>;
  index: number;
}

// ! TO AVOID Record<string, any> - take only the actual data you need from playlist.ts for tracks!!!

function FullPreviewTrackItem({ track, index }: TrackProps) {
  const navigate = useNavigate();
  const { screenWidth: screenWidthRem } = useScreenWidthRem();

  const [isTrackBoxSelected, setIsTrackBoxSelected] = useState(false);
  const [isTrackHovered, setIsTrackHovered] = useState(false);

  const trackName = track.name;
  const artistsToDisplay = track.artists
    .map((artist: Record<string, any>) => artist.name)
    .join(", ");

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

  const handleTrackSelect = (e: React.MouseEvent<HTMLElement>) => {
    console.log(e);
    navigate(`/home/track/${e.currentTarget.id}`);
  };

  const handleArtistSelect = (id: string) => {
    navigate(`/home/artist/${id}`);
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
          {trackName}
        </span>
        <span className="text-2xs w-fit truncate md:text-sm lg:text-sm">
          {/* // ! loop artists, save id, print name */}
          {track.artists.map((artistObj: Record<string, any>, i: number) => (
            <span
              key={artistObj.id}
              onClick={() => handleArtistSelect(artistObj.id)}
              className="underline-offset-1 hover:cursor-pointer hover:underline"
            >
              {i + 1 === track.artists.length
                ? artistObj.name
                : `${artistObj.name}, `}
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

      <TrackOptions
        trackName={trackName}
        isTrackBoxSelected={isTrackBoxSelected}
        setIsTrackBoxSelected={setIsTrackBoxSelected}
        artistsToDisplay={artistsToDisplay}
        isTrackHovered={isTrackHovered}
      />
    </div>
  );
}

export default memo(FullPreviewTrackItem);
