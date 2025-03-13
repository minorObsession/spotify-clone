interface RecentThumbnailProps {
  img: string;
}

function RecentThumbnail({ img }: RecentThumbnailProps) {
  return (
    <div className="row-span-2 flex items-center">
      <img src={img} />
    </div>
  );
}

export default RecentThumbnail;
