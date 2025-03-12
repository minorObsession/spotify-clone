import RecentNameAndProgress from "./RecentNameAndProgress";
import RecenThumbnail from "./RecenThumbnail";

interface RecentTabProps {
  children: React.ReactNode;
}

const RecentTab: React.FC<RecentTabProps> = ({ children }) => {
  return (
    <article className="grid max-w-1/2 grow grid-cols-[1fr_3fr] grid-rows-[2fr_1fr] p-1">
      <RecenThumbnail />
      <RecentNameAndProgress />
    </article>
  );
};

export default RecentTab;
