import { AlbumType } from "./album";

interface FPAlbumOverviewProps {
  data: AlbumType;
}

// // ! idea for image - loop thru pixels and determine how similar they are.. if so, then move to another object-pos where pixels are more diverse

function FPAlbumOverview({ data }: FPAlbumOverviewProps) {
  return (
    // /* // ! artist background image  */
    <div className="relative max-h-[40%]">
      <img
        src={data.imageUrl}
        // ! or: object-[center_35%]
        className="max-h-full w-full object-cover object-[center]"
      />
      {/* // ! Artist Info Div */}
      <div className="absolute bottom-5 left-5 grid items-center md:text-lg lg:text-xl">
        <h5 className="">Verified {data.type} --add icon--</h5>
        <h1 className="text-xl font-bold text-nowrap sm:text-3xl md:text-7xl">
          {data.name}
        </h1>

        {/* <h3>{data.numFollowers} montly listeners</h3> */}
      </div>
    </div>
  );
}

export default FPAlbumOverview;
