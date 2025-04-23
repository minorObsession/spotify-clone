import ProgressBar from "../../components/ProgressBar";
import { HiOutlineQueueList } from "react-icons/hi2";
import CurrentlyPlayng from "../../features/playback/CurrentlyPlayng";
import PlayButton from "../../components/PlayButton";
import { useStateStore } from "../../state/store";

function DesktopPlayback() {
  const { currVolume, playerState } = useStateStore((state) => state);
  const { setCurrentVolume } = useStateStore((state) => state);

  if (!playerState) return null;

  return (
    <footer className="grid-playback-l z-10 col-span-2 flex h-[clamp(10lvh_15lvh_10rem)] w-screen items-center justify-between gap-10 bg-amber-200 px-3">
      {/* // ! currently playing item (reuse grid from sidebar) */}
      <CurrentlyPlayng />

      {/* // ! PLAYBACK CENTER BOX */}
      <div className="mx-auto flex flex-2 flex-col items-center justify-center gap-2">
        {/* // ! BUTTONS */}
        <div className="flex gap-2">
          {/* <SlControlPlay /> */}
          {/* <SlControlPlay /> */}
          {/* // * play/pause */}
          <PlayButton />
          {/* <SlControlPlay /> */}
          {/* <SlControlPlay /> */}
        </div>
        <ProgressBar
          max={playerState?.duration}
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
          onValueChange={(value) => setCurrentVolume(value)}
          additionalClasses="max-w-28"
        />
        <HiOutlineQueueList />
      </div>
    </footer>
  );
}

export default DesktopPlayback;
