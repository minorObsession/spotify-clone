import { ArtistType } from "./artist";

interface FullPreviewOverviewProps {
  data: ArtistType;
}

// ! idea for image - loop thru pixels and determine how similar they are.. if so, then move to another object-pos where pixels are more diverse

// CONSIDER REFACTORING FIRST - LOADERS, PREVIEWS,OVERVIEWS ETC...
function FullPreviewArtistOverview({ data }: FullPreviewOverviewProps) {
  return (
    <>
      {/* // ! artist background image  */}
      <div className="max-h-[40%]">
        <img
          src={data.imageUrl}
          className="max-h-full w-full object-cover object-[center_35%]"
        />
      </div>

      {/* // ! Playlist/Track Info Div */}
      <div className="grid items-center md:text-lg lg:text-xl">
        <h5 className="">Verified {data.type} --add icon--</h5>
        <h1 className="text-xl font-bold sm:text-3xl md:text-4xl lg:w-[12ch] lg:whitespace-pre-wrap">
          {data.artistName}
        </h1>
        <h3>{data.numFollowers} montly listeners</h3>
      </div>
    </>
  );
}

export default FullPreviewArtistOverview;
