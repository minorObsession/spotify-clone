import { SlControlPlay } from "react-icons/sl";

function MobilePlayback() {
  return (
    <div
      className={`grid-playback-m flex h-full items-center justify-between gap-5 border-2 px-3 py-2 text-sm`}
    >
      <img src="/src/assets/react.svg" alt="thumbnail" className="w-8" />
      <div className="grow">
        <p className="text-2xs text-nowrap">Episode name/track name</p>
        <p className="text-2xs text-nowrap">Show title/artist name</p>
      </div>
      <SlControlPlay />
    </div>
  );
}

export default MobilePlayback;
