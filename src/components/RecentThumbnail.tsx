interface RecentThumbnailProps {
  img: string;
}

function RecentThumbnail({ img }: RecentThumbnailProps) {
  return (
    <div className="row-span-2 flex w-[minmax(4rem_12rem)] items-center">
      <img src={img} />
    </div>
  );
}

export default RecentThumbnail;
