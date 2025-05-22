import { memo } from "react";
import Thumbnail from "../../components/Thumbnail";

import { TopTrackType } from "./artist";
import TrackOptions from "../tracks/TrackOptions";
import { useTrackItem } from "../../hooks/useTrackItem";
import AddToPlaylist from "../../components/AddToPlaylist";
import { trackOptions } from "../../config/menuOptions";
import { FaPlay } from "react-icons/fa";
import ArtistList, { Artist } from "../../components/ArtistList";

interface TrackProps {
  track: TopTrackType;
  index?: number;
}

function FPSearchTopTrack({ track, index }: TrackProps) {
  const {
    // screenWidthRem,
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
      className={`search-top-track-row text:xs ${!isTrackBoxSelected && "hover:bg-amber-400"} ${isTrackBoxSelected && "bg-amber-700"} lg:text-lg`}
    >
      {/* // * # - THUMB - NAME */}
      <div className="playlist-item grid-rows-1 truncate p-1">
        {/* // ! thumbnail   */}
        <div className="row-span-2 flex items-center gap-2 lg:gap-3">
          <div className="relative">
            <Thumbnail
              additionalClasses={`w-7 md:w-7.5 lg:w-8.5 ${isTrackHovered ? "brightness-70" : ""}`}
              img={thumbnailUrl}
            />
            {isTrackHovered && (
              <FaPlay
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-white"
                size={12}
                onClick={handleTrackSelect}
                id={id}
              />
            )}
          </div>
        </div>
        {/* // ! TRACK name */}

        <span
          onClick={handleTrackSelect}
          id={id}
          // ! TODO: add green color to track if currently playing
          className={`w-fit max-w-fit cursor-pointer truncate underline-offset-1 hover:underline ${false ? "text-green-700" : ""}`}
        >
          {trackName}
        </span>
        <span className="text-2xs w-fit truncate md:text-sm">
          <ArtistList
            artists={track?.artists as Artist[]}
            addClassName="text-2xs md:text-sm"
          />
        </span>
      </div>

      {/* // ! */}
      <div className="track-utilities col-span-3">
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

export default memo(FPSearchTopTrack);
