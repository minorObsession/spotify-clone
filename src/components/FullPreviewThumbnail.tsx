import Thumbnail from "./Thumbnail";

interface FullPreviewThumbnailProps {
  imageUrl: string;
}

function FullPreviewThumbnail({ imageUrl }: FullPreviewThumbnailProps) {
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

export default FullPreviewThumbnail;
