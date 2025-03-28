import Thumbnail from "./Thumbnail";

// interface SuggestionType {}

function Suggestion() {
  return (
    <div className="flex w-40 flex-col gap-2 border-1 p-1">
      <div className="">
        <Thumbnail
          img="https://mosaic.scdn.co/640/ab67616d00001e024ca68d59a4a29c856a4a39c2ab67616d00001e025fd7c284c0b719ad07b8eac2ab67616d00001e0270b88fc5a2e13bc5440d947cab67616d00001e029e1cfc756886ac782e363d79"
          minWidth="w-[100%]"
        />
      </div>
      <p className="truncate">
        artists display long saguyfagafsgfajfgjfasgasgfasgf
      </p>
    </div>
  );
}

export default Suggestion;
