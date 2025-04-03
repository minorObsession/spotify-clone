import { memo } from "react";
import Thumbnail from "../../components/Thumbnail";

import { TopTrackType } from "./artist";
import TrackOptions from "../tracks/TrackOptions";
import { useTrackItem } from "../../hooks/useTrackItem";

interface TrackProps {
  track: TopTrackType;
  index: number;
}

function FPArtistTrackItem({ track, index }: TrackProps) {
  console.log(track);
  const {
    screenWidthRem,
    isTrackBoxSelected,
    setIsTrackBoxSelected,
    isTrackHovered,
    setIsTrackHovered,
    trackName,
    trackDurationFormatted,
    thumbnailUrl,
    handleTrackSelect,
    menuOptions,
  } = useTrackItem(track);

  return (
    <article
      onMouseEnter={() => setIsTrackHovered(true)}
      onMouseLeave={() => setIsTrackHovered(false)}
      onClick={() => setIsTrackBoxSelected(true)}
      className={`top-track-row text:xs grid-cols-[2fr_2fr_1fr_0.5fr] ${!isTrackBoxSelected && "hover:bg-amber-400"} ${isTrackBoxSelected && "bg-amber-700"} lg:text-lg`}
    >
      <div className="playlist-item grid-rows-1 truncate p-1">
        {/* // ! number + thumbnail   */}
        <div className="row-span-2 flex items-center gap-2 lg:gap-3">
          <span className="">{index + 1}</span>
          <Thumbnail
            additionalClasses="w-7 md:w-7.5 lg:w-8.5"
            img={thumbnailUrl}
          />
        </div>
        {/* // ! TRACK name */}
        <span
          onClick={handleTrackSelect}
          id={track.trackId}
          className="w-fit truncate underline-offset-1 hover:cursor-pointer hover:underline"
          key={track.trackId}
        >
          {trackName}
        </span>
      </div>
      {/* // ! fetch views */}
      {screenWidthRem > 64 && <p className="truncate">{"viewsss"}</p>}
      <p className="text-right">{trackDurationFormatted}</p>
      {/* // ! only when hovered */}
      <TrackOptions
        options={menuOptions}
        trackName={trackName}
        isTrackBoxSelected={isTrackBoxSelected}
        setIsTrackBoxSelected={setIsTrackBoxSelected}
        // artistsToDisplay={track.artists.map((a) => a.name)}
        isTrackHovered={isTrackHovered}
      />
    </article>
  );
}

export default memo(FPArtistTrackItem);
