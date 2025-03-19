interface RecentThumbnailProps {
  img: string;
}

function RecentThumbnail({ img }: RecentThumbnailProps) {
  return <img className="row-span-2 w-10 max-w-12 min-w-8" src={img} />;
}

export default RecentThumbnail;
