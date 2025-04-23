import ProgressBar from "../../components/ProgressBar";
import { HiOutlineQueueList } from "react-icons/hi2";
import CurrentlyPlayng from "../../features/playback/CurrentlyPlayng";
import PlayButton from "../../components/PlayButton";

function DesktopPlayback() {
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
        <ProgressBar max={100} currValue={45} />
      </div>
      {/* //! VOLUME AND QUEUE */}
      <div className="flex flex-1 items-center justify-end gap-2">
        <HiOutlineQueueList />
        {/* <VolumeControl /> */}
        <ProgressBar max={20} currValue={15} additionalClasses="max-w-28" />
        <HiOutlineQueueList />
      </div>
    </footer>
  );
}

export default DesktopPlayback;
