import { memo } from "react";
import Thumbnail from "../../components/Thumbnail";

import { TopTrackType } from "./artist";
import TrackOptions from "../tracks/TrackOptions";
import { useTrackItem } from "../../hooks/useTrackItem";
import AddToPlaylist from "../../components/AddToPlaylist";

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
    menuOptions,
  } = useTrackItem(track);
  const trackId = track.trackId;

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
          id={trackId}
          className="w-fit truncate underline-offset-1 hover:cursor-pointer hover:underline"
          key={trackId}
        >
          {trackName}
        </span>
      </div>

      {/* // * VIEWS */}
      {screenWidthRem > 64 && <p className="truncate">{"viewsss"}</p>}
      {/* // ! only when hovered */}
      <AddToPlaylist
        trackId={trackId}
        isTrackHovered={isTrackHovered}
        isTrackBoxSelected={isTrackBoxSelected}
      />
      {/* // * DURATION */}

      <p className="text-right">{trackDurationFormatted}</p>

      <TrackOptions
        options={menuOptions}
        trackName={trackName}
        isTrackBoxSelected={isTrackBoxSelected}
        setIsTrackBoxSelected={setIsTrackBoxSelected}
        isTrackHovered={isTrackHovered}
      />
    </article>
  );
}

export default memo(FPArtistTrackItem);
