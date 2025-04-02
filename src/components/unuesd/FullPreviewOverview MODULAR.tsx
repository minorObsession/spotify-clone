import Thumbnail from "./Thumbnail";

interface PreviewOverviewProps {
  imageUrl: string;
  name: string;
  ownerName: string;
  type: string;
  additionalInfo: React.ReactNode;
  additionalClasses?: string;
}

function PreviewOverview({
  imageUrl,
  name,
  ownerName,
  type,
  additionalInfo,
  additionalClasses = "",
}: PreviewOverviewProps) {
  return (
    <div className={`flex gap-3 border-b-2 py-4 ${additionalClasses}`}>
      {/* // ! Image */}
      <div className="aspect-square flex-[0_1_20%]">
        <Thumbnail
          img={imageUrl}
          minWidth="w-full"
          additionalClasses="w-full h-full object-contain"
        />
      </div>

      {/* // ! Info */}
      <div className="grid items-center md:text-lg lg:text-xl">
        <h5>{type}</h5>
        <h1 className="text-xl font-bold sm:text-3xl md:text-4xl lg:w-[12ch] lg:whitespace-pre-wrap">
          {name}
        </h1>
        <div className="flex items-center gap-1">
          {/* // ! Owner/Artist Name */}
          <span className="underline-offset-1 hover:cursor-pointer hover:underline">
            {ownerName}
          </span>

          {/* // !  Additional Info (like length, album, etc.) */}
          {additionalInfo}
        </div>
      </div>
    </div>
  );
}

export default PreviewOverview;
