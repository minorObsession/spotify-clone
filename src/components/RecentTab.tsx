import RecentNameAndProgress from "./RecentNameAndProgress";
import RecentThumbnail from "./RecentThumbnail";

interface RecentTabProps {
  // key:
}

function RecentTab({}: RecentTabProps) {
  return (
    <article className="grid max-w-1/2 grow grid-cols-[1fr_3fr] grid-rows-[2fr_1fr] p-1 md:max-w-full">
      {/* // ! ATTACH THUMBNAIL OF RECENTLY PLAYED */}
      <RecentThumbnail img="https://mosaic.scdn.co/640/ab67616d00001e024ca68d59a4a29c856a4a39c2ab67616d00001e025fd7c284c0b719ad07b8eac2ab67616d00001e0270b88fc5a2e13bc5440d947cab67616d00001e029e1cfc756886ac782e363d79" />
      <RecentNameAndProgress />
    </article>
  );
}

export default RecentTab;
