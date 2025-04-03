import { memo } from "react";
import Thumbnail from "../../components/Thumbnail";
import { useNavigate } from "react-router";
import TrackOptions from "./TrackOptions";
import { TrackType } from "./track";
import { useTrackItem } from "../../hooks/useTrackItem";

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
    menuOptions,
  } = useTrackItem(track);

  const navigate = useNavigate();

  const handleArtistSelect = (id: string) => {
    navigate(`/home/artist/${id}`);
  };

  const album = track.albumName;

  return (
    <article
      onMouseEnter={() => setIsTrackHovered(true)}
      onMouseLeave={() => setIsTrackHovered(false)}
      onClick={() => setIsTrackBoxSelected(true)}
      className={`playlist-row text:xs ${!isTrackBoxSelected && "hover:bg-amber-400"} ${isTrackBoxSelected && "bg-amber-700"} lg:text-lg`}
    >
      <div className="playlist-item truncate p-1">
        {/* // ! number + thumbnail   */}
        <div className="row-span-2 flex items-center gap-2 lg:gap-3">
          <span>{index + 1}</span>
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
        <span className="text-2xs w-fit truncate md:text-sm lg:text-sm">
          {/* // ! loop artists, save id, print name */}
          {track.artists.map((artist, i, array) => (
            <span
              key={artist.artistId}
              onClick={() => handleArtistSelect(artist.artistId)}
              className="underline-offset-1 hover:cursor-pointer hover:underline"
            >
              {i + 1 === array.length ? artist.name : `${artist.name}, `}
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

      <p className="text-right">{trackDurationFormatted}</p>
      {/* // ! only when hovered */}

      <TrackOptions
        options={menuOptions}
        trackName={trackName}
        isTrackBoxSelected={isTrackBoxSelected}
        setIsTrackBoxSelected={setIsTrackBoxSelected}
        artistsToDisplay={track.artists.map((a) => a.name)}
        isTrackHovered={isTrackHovered}
      />
    </article>
  );
}

export default memo(FPPlaylistTrackItem);
