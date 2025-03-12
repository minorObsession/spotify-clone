import RecentNameAndProgress from "./RecentNameAndProgress";
import RecenThumbnail from "./RecenThumbnail";

interface RecentTabProps {
  children: React.ReactNode;
}

const RecentTab: React.FC<RecentTabProps> = () => {
  return (
    <article className="grid grid-cols-[1fr_3fr] grid-rows-[2fr_1fr] p-0.5">
      <RecenThumbnail />
      <RecentNameAndProgress />
    </article>
  );
};

export default RecentTab;
