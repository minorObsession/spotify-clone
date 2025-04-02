import { TrackType } from "../../features/tracks/track";
import FullPreviewOverview from "./FullPreviewOverview MODULAR";

interface FullPreviewTrackOverviewProps {
  data: TrackType;
}

function FullPreviewTrackOverview({ data }: FullPreviewTrackOverviewProps) {
  const additionalInfo = (
    <>
      <span className="underline-offset-1 hover:cursor-pointer hover:underline">
        {data.artists[0]}
      </span>
      <span className="underline-offset-1 hover:cursor-pointer hover:underline">
        {data.albumName}
      </span>
      <span className="underline-offset-1 hover:cursor-pointer hover:underline">
        {new Date(data.releaseDate).getFullYear()}
      </span>
      <span className="underline-offset-1 hover:cursor-pointer hover:underline">
        {data.trackDuration}
      </span>
    </>
  );

  return (
    <FullPreviewOverview
      imageUrl={data.imageUrl}
      name={data.name}
      ownerName={data.artists[0]} // You can adjust this as needed
      type={data.type}
      additionalInfo={additionalInfo}
    />
  );
}

export default FullPreviewTrackOverview;
