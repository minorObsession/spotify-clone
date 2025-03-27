import { memo } from "react";
import { flexibleMillisecondsConverter } from "../helpers/helperFunctions";

interface TrackProps {
  track: Record<string, any>;
}

function FullPreviewTrack({ track }: TrackProps) {
  console.log(track);

  const artists = track.artists.reduce(
    (acc: string, artist: Record<string, any>, i, array) => {
      let artistNamePlus = artist.name + ", ";

      if (i + 1 === array.length)
        artistNamePlus = artistNamePlus.replace(",", "");

      acc += artistNamePlus;
      return acc;
    },
    "",
  );
  const album = track.album.name;
  // const dateAdded =
  const playbackTime = track.duration_ms;

  return (
    // ! look up container in TW
    <div className="container grid grid-cols-4 items-center justify-between border border-b-2">
      <div className="flex flex-col">
        <p className="" key={track.name}>
          {track.name}
        </p>
        <p className="">{artists}</p>
      </div>

      <p className="">{album}</p>

      <p className="">date added</p>
      <p className="">
        {
          // ! MAKE A HELPER TO DO THIS FORMATTING!!
          flexibleMillisecondsConverter(playbackTime)
          // .replace("min", ":")
          // .replace("s", "")
          // .padEnd(5, 0)
          // .replace(" ", "")
        }
      </p>
    </div>
  );
}

export default memo(FullPreviewTrack);
