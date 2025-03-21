interface ThumbnailProps {
  img: string;
  width?: string;
  additionalClasses?: string;
}

function Thumbnail({ img, width = "w-12", additionalClasses }: ThumbnailProps) {
  return (
    <img
      className={`row-span-2 aspect-square ${width} min-w-full ${additionalClasses}`}
      src={img}
    />
  );
}

export default Thumbnail;
