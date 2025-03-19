import RecentNameAndProgress from "./RecentNameAndProgress";
import RecenThumbnail from "./RecentThumbnail";

interface RecentTabProps {
  // key:
}

function RecentTab({}: RecentTabProps) {
  return (
    <article className="grid max-w-1/2 grow grid-cols-[1fr_3fr] grid-rows-[2fr_1fr] p-1 md:max-w-full">
      {/* // ! ATTACH THUMBNAIL OF RECENTLY PLAYED */}
      {/* <RecenThumbnail /> */}
      <RecentNameAndProgress />
    </article>
  );
}

export default RecentTab;
