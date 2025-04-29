import { memo } from "react";
import Thumbnail from "../../components/Thumbnail";
import { useNavigate } from "react-router";
import TrackOptions from "./TrackOptions";
import { TrackType } from "./track";
import { useTrackItem } from "../../hooks/useTrackItem";
import AddToPlaylist from "../../components/AddToPlaylist";
import { trackOptions } from "../../config/menuOptions";

import TrackStatusOrIndex from "../../components/TrackStatusOrIndex";
import { useStateStore } from "../../state/store";
interface TrackProps {
  track: TrackType;
  index: number;
}

// ! TO AVOID Record<string, any> - take only the actual data you need from playlist.ts for tracks!!!

function FPPlaylistTrackItem({ track, index }: TrackProps) {
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

  const navigate = useNavigate();

  const handleArtistSelect = (id: string) => {
    navigate(`/home/artist/${id}`);
  };

  const id = track?.id;
  const album = track?.albumName;
  const artistsToDisplay = track?.artists.map((artist) => " " + artist.name);
  const { playerState } = useStateStore((state) => state);

  const isTrackCurrentlyQueued =
    playerState?.track_window?.current_track?.id === track?.id ||
    playerState?.track_window?.current_track?.name === track.name;

  return (
    <article
      onMouseEnter={() => setIsTrackHovered(true)}
      onMouseLeave={() => setIsTrackHovered(false)}
      onClick={() => setIsTrackBoxSelected(true)}
      className={`playlist-row text:xs ${!isTrackBoxSelected && "hover:bg-amber-400"} ${isTrackBoxSelected && "bg-amber-700"} lg:text-base`}
    >
      <div className="playlist-item p-1">
        {/* // ! index/bars + thumbnail   */}
        <div className="row-span-2 flex items-center lg:gap-2">
          <TrackStatusOrIndex
            handleTrackSelect={(e) => handleTrackSelect(e, index)}
            isTrackHovered={isTrackHovered}
            track={track}
            index={index}
            id={id}
          />
          <Thumbnail
            additionalClasses="w-7 md:w-7.5 lg:w-8.5"
            img={thumbnailUrl}
          />
        </div>
        {/* // ! TRACK name */}
        <span
          onClick={handleTrackSelect}
          id={id}
          className={`w-fittruncate max-w-fit cursor-pointer underline-offset-1 hover:underline ${isTrackCurrentlyQueued ? "text-green-700" : ""}`}
        >
          {trackName}
        </span>
        <span className="text-2xs w-fit truncate md:text-sm">
          {/* // ! loop artists, save id, print name */}
          {track.artists.map((artist, i, array) => (
            <span
              key={artist.artistId + i}
              onClick={() => handleArtistSelect(artist.artistId)}
              className="cursor-pointer underline-offset-1 hover:underline"
            >
              {i + 1 === array.length ? artist.name : `${artist.name}, `}
            </span>
          ))}
        </span>
      </div>

      {screenWidthRem > 64 && (
        <span className="cursor-pointer truncate text-sm underline-offset-1 hover:underline">
          {album}
        </span>
      )}

      {screenWidthRem > 102 && <p className="truncate text-sm">date</p>}

      {/* // ! THIS ONE IS CORRECT */}
      {/* // ! only when hovered */}
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
          artistsToDisplay={artistsToDisplay}
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

export default memo(FPPlaylistTrackItem);
