import ProgressBar from "../../components/ProgressBar";
import { HiOutlineQueueList } from "react-icons/hi2";
import CurrentlyPlayng from "../../features/playback/CurrentlyPlayng";
import PlayButton from "../../components/PlayButton";
import { useStateStore } from "../../state/store";
import { MdSkipPrevious } from "react-icons/md";
import { MdSkipNext } from "react-icons/md";
import { LuRepeat1 } from "react-icons/lu";
import { LuRepeat } from "react-icons/lu";
import { FaShuffle } from "react-icons/fa6";
import { useEffect, useState } from "react";
import FooterSkeleton from "../../components/FooterSkeleton";

export interface CurrentTrack {
  artistsArr: Spotify.Entity[];
  trackName: string;
  trackImg: string;
}

function DesktopPlayback() {
  const {
    currVolume,
    playerState,
    isPlayerLoading,
    setVolume,
    seekToPosition,
    prevTrack,
    nextTrack,
    setPlayerState,
  } = useStateStore((state) => state);
  const [repeatMode, setRepeatMode] = useState<"off" | "one" | "all">("all");

  const currentTrack: CurrentTrack = {
    artistsArr: playerState?.track_window?.current_track?.artists || [],
    trackName: playerState?.track_window?.current_track?.name || "",
    trackImg:
      playerState?.track_window?.current_track?.album?.images[0].url || "",
  };

  const renderRepeatIcon = () => {
    switch (repeatMode) {
      case "one":
        return <LuRepeat1 onClick={() => setRepeatMode("all")} />;
      case "all":
        // ! modify repeat icon sliglty - dot bellow and change color
        return (
          <LuRepeat
            color="oklch(44.8% 0.119 151.328)"
            onClick={() => setRepeatMode("off")}
          />
        );
      default:
        return <LuRepeat onClick={() => setRepeatMode("one")} />;
    }
  };

  useEffect(() => {
    if (!playerState || playerState.paused) return;

    const interval = setInterval(() => {
      setPlayerState((prev) =>
        prev ? { ...prev, position: prev.position + 1000 } : prev,
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [playerState?.paused, playerState, setPlayerState]);

  if (isPlayerLoading || !playerState) return <FooterSkeleton />;

  return (
    <footer className="grid-playback-l z-10 col-span-2 flex h-[clamp(10lvh_15lvh_10rem)] w-screen items-center justify-between gap-10 bg-amber-200 px-3 py-2">
      {/* // ! currently playing item (reuse grid from sidebar) */}
      <CurrentlyPlayng currentTrack={currentTrack} />

      {/* // ! PLAYBACK CENTER BOX */}
      <div className="mx-auto flex flex-2 flex-col items-center justify-center gap-2">
        {/* // ! BUTTONS */}
        <div className="flex gap-2">
          <FaShuffle className="cursor-pointer" />
          <MdSkipPrevious className="cursor-pointer" onClick={prevTrack} />
          <PlayButton />
          <MdSkipNext className="cursor-pointer" onClick={nextTrack} />
          {/* icon contaier */}
          <span
            className={`flex cursor-pointer flex-col items-center ${repeatMode === "all" ? "after:color-green-500 after:absolute after:text-green-700 after:content-['.']" : ""}`}
          >
            {renderRepeatIcon()}
          </span>
        </div>
        <ProgressBar
          currValue={playerState?.position || 0}
          max={playerState?.duration || 1}
          onValueChange={(value) => seekToPosition(value)}
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
