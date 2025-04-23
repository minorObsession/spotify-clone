import { useNavigate } from "react-router";
import Thumbnail from "../../components/Thumbnail";
import { useStateStore } from "../../state/store";

function CurrentlyPlayng() {
  const { playerState } = useStateStore((state) => state);

  const artistsArr = playerState?.track_window?.current_track?.artists;
  const navigate = useNavigate();
  const trackName = playerState?.track_window?.current_track?.name || "";

  const handleArtistSelect = (artistId: string) => {
    navigate(`/home/artist/${artistId}`);
  };

  return (
    <div
      className="playlist-item max-w-[30%] flex-1 gap-x-4"
      onClick={() => {}}
    >
      <Thumbnail
        minWidth="w-12"
        img="https://mosaic.scdn.co/640/ab67616d00001e024ca68d59a4a29c856a4a39c2ab67616d00001e025fd7c284c0b719ad07b8eac2ab67616d00001e0270b88fc5a2e13bc5440d947cab67616d00001e029e1cfc756886ac782e363d79"
      />
      <p className="playlist-title">{trackName}</p>
      {artistsArr && (
        <p>
          {artistsArr.map((artist, i, array) => (
            <span
              key={artist.uri + i}
              onClick={() => handleArtistSelect(artist.uri.split(":")[2])}
              className="playlist-owner underline-offset-1 hover:cursor-pointer hover:underline"
            >
              {i + 1 === array.length ? artist.name : `${artist.name}, `}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

export default CurrentlyPlayng;
