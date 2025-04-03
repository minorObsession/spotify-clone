import Thumbnail from "./Thumbnail";

interface FPOverviewThumbnailProps {
  imageUrl: string;
}

function FPOverviewThumbnail({ imageUrl }: FPOverviewThumbnailProps) {
  return (
    <div className="aspect-square flex-[0_1_20%]">
      <Thumbnail
        img={imageUrl}
        minWidth="w-full"
        additionalClasses="w-full h-full object-contain"
      />
    </div>
  );
}

export default FPOverviewThumbnail;
