import ProgressBar from "../../components/ProgressBar";
import { HiOutlineQueueList } from "react-icons/hi2";
import CurrentlyPlayng from "../../features/playback/CurrentlyPlayng";
import PlayButton from "../../components/PlayButton";
import { useStateStore } from "../../state/store";
import { MdSkipPrevious } from "react-icons/md";
import { MdSkipNext } from "react-icons/md";
import { LuRepeat1 } from "react-icons/lu";
import { LuRepeat } from "react-icons/lu";
import { useState } from "react";

function DesktopPlayback() {
  const {
    currVolume,
    playerState,
    setVolume,
    seekToPosition,
    prevTrack,
    nextTrack,
  } = useStateStore((state) => state);
  const [repeatMode, setRepeatMode] = useState<"off" | "one" | "all">("off");

  const renderRepeatIcon = () => {
    switch (repeatMode) {
      case "one":
        return <LuRepeat1 onClick={() => setRepeatMode("all")} />;
      case "all":
        // ! modify repeat icon sliglty - dot bellow and change color
        return <LuRepeat onClick={() => setRepeatMode("off")} />;
      default:
        return <LuRepeat onClick={() => setRepeatMode("one")} />;
    }
  };

  // ! THIS MAKES FOR A VERY SLOW INITIAL RENDER... FIND A OPTIMISTIC BAREBONES RENDER SOLUTION
  if (!playerState) return null;

  return (
    <footer className="grid-playback-l z-10 col-span-2 flex h-[clamp(10lvh_15lvh_10rem)] w-screen items-center justify-between gap-10 bg-amber-200 px-3">
      {/* // ! currently playing item (reuse grid from sidebar) */}
      <CurrentlyPlayng />

      {/* // ! PLAYBACK CENTER BOX */}
      <div className="mx-auto flex flex-2 flex-col items-center justify-center gap-2">
        {/* // ! BUTTONS */}
        <div className="flex gap-2">
          <MdSkipPrevious className="cursor-pointer" onClick={prevTrack} />
          <PlayButton />
          <MdSkipNext className="cursor-pointer" onClick={nextTrack} />

          {renderRepeatIcon()}
        </div>
        <ProgressBar
          max={playerState?.duration}
          onValueChange={(value) => seekToPosition(value)}
          currValue={playerState?.position}
        />
      </div>
      {/* //! VOLUME AND QUEUE */}
      <div className="flex flex-1 items-center justify-end gap-2">
        <HiOutlineQueueList />
        {/* <VolumeControl /> */}
        <ProgressBar
          max={1}
          currValue={currVolume}
          onValueChange={(value) => setVolume(value)}
          additionalClasses="max-w-28"
        />
        <HiOutlineQueueList />
      </div>
    </footer>
  );
}

export default DesktopPlayback;
