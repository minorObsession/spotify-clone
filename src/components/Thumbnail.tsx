interface ThumbnailProps {
  img: string;
  minWidth?: string;
  additionalClasses?: string;
}

function Thumbnail({
  img,
  minWidth = "min-w-7",
  additionalClasses,
}: ThumbnailProps) {
  return (
    <img
      className={`row-span-2 aspect-square ${minWidth} ${additionalClasses || ""}`}
      src={img}
    />
  );
}

export default Thumbnail;
