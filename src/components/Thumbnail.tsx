interface ThumbnailProps {
  img: string;
  width?: string;
}

function Thumbnail({ img, width = "w-12" }: ThumbnailProps) {
  return <img className={`row-span-2 ${width}`} src={img} />;
}

export default Thumbnail;
