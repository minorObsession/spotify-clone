import { memo } from "react";
import Thumbnail from "../../components/Thumbnail";

import { TopTrackType } from "./artist";
import TrackOptions from "../tracks/TrackOptions";
import { useTrackItem } from "../../hooks/useTrackItem";
import AddToPlaylist from "../../components/AddToPlaylist";
import { trackOptions } from "../../config/menuOptions";

interface TrackProps {
  track: TopTrackType;
  index: number;
}

function FPArtistTrackItem({ track, index }: TrackProps) {
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
  } = useTrackItem(track);
  const id = track.id;
  console.log(track);
  return (
    <article
      onMouseEnter={() => setIsTrackHovered(true)}
      onMouseLeave={() => setIsTrackHovered(false)}
      onClick={() => setIsTrackBoxSelected(true)}
      className={`top-track-row text:xs grid-cols-[2fr_2fr_1fr_0.5fr] ${!isTrackBoxSelected && "hover:bg-amber-400"} ${isTrackBoxSelected && "bg-amber-700"} lg:text-lg`}
    >
      {/* // * # - THUMB - NAME */}
      <div className="playlist-item grid-rows-1 truncate p-1">
        {/* // ! number + thumbnail   */}
        <div className="row-span-2 flex items-center gap-2 lg:gap-3">
          <span className="w-4">{index + 1}</span>
          <Thumbnail
            additionalClasses="w-7 md:w-7.5 lg:w-8.5"
            img={thumbnailUrl}
          />
        </div>
        {/* // ! TRACK name */}
        <span
          onClick={handleTrackSelect}
          id={id}
          className="truncate underline-offset-1 hover:cursor-pointer hover:underline"
          key={id}
        >
          {trackName}
        </span>
      </div>

      {/* // * # plays */}
      {screenWidthRem > 64 && <p className="truncate">{"viewsss"}</p>}
      {/* // ! */}
      <div className="track-utilities">
        <AddToPlaylist
          id={id}
          isTrackHovered={isTrackHovered}
          isTrackBoxSelected={isTrackBoxSelected}
        />
        {/* // * DURATION */}
        <span className="text-2xs font-mono tabular-nums">
          {trackDurationFormatted}
        </span>
        <TrackOptions
          options={trackOptions}
          trackName={trackName}
          isTrackBoxSelected={isTrackBoxSelected}
          setIsTrackBoxSelected={setIsTrackBoxSelected}
          isTrackHovered={isTrackHovered}
        />
      </div>
    </article>
  );
}

export default memo(FPArtistTrackItem);
