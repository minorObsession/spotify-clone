import { memo } from "react";
import Thumbnail from "../../components/Thumbnail";

import { TopTrackType } from "./artist";
import TrackOptions from "../tracks/TrackOptions";
import { useTrackItem } from "../../hooks/useTrackItem";
import AddToPlaylist from "../../components/AddToPlaylist";
import { trackOptions } from "../../config/menuOptions";
import { FaPlay } from "react-icons/fa";

interface TrackProps {
  track: TopTrackType;
  index?: number;
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

  return (
    <article
      onMouseEnter={() => setIsTrackHovered(true)}
      onMouseLeave={() => setIsTrackHovered(false)}
      onClick={() => setIsTrackBoxSelected(true)}
      className={`album-top-track-row text:xs ${!isTrackBoxSelected && "hover:bg-amber-400"} ${isTrackBoxSelected && "bg-amber-700"} lg:text-lg`}
    >
      {/* // * # - THUMB - NAME */}
      <div className="playlist-item grid-rows-1 truncate p-1">
        {/* // ! number + thumbnail   */}
        <div className="row-span-2 flex items-center gap-2 lg:gap-3">
          <span className="w-4">
            {" "}
            {isTrackHovered ? (
              <FaPlay
                id={id}
                onClick={handleTrackSelect}
                size={12}
                className="cursor-pointer"
              />
            ) : index ? (
              index + 1
            ) : (
              ""
            )}
          </span>

          <Thumbnail
            additionalClasses="w-7 md:w-7.5 lg:w-8.5"
            img={thumbnailUrl}
          />
        </div>
        {/* // ! TRACK name */}
        <span
          onClick={handleTrackSelect}
          id={id}
          className="w-fit truncate underline-offset-1 hover:cursor-pointer hover:underline"
          key={id}
        >
          {trackName}
        </span>
      </div>

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
