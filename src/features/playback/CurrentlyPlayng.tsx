import { useNavigate } from "react-router";
import Thumbnail from "../../components/Thumbnail";
import { useStateStore } from "../../state/store";
import { CurrentTrack } from "../../layouts/desktop/DesktopPlayback";

interface CurrentlyPlayngProps {
  currentTrack: CurrentTrack;
}

function CurrentlyPlayng({ currentTrack }: CurrentlyPlayngProps) {
  const { playerState } = useStateStore((state) => state);
  const navigate = useNavigate();

  if (!playerState) return null;

  const handleArtistSelect = (artistId: string) => {
    navigate(`/home/artist/${artistId}`);
  };

  return (
    <div className="playlist-item max-w-[30%] flex-1 gap-x-4">
      <Thumbnail minWidth="w-12" img={currentTrack.trackImg || ""} />
      <p className="playlist-title">{currentTrack.trackName}</p>
      {currentTrack.artistsArr && (
        <p>
          {currentTrack.artistsArr.map((artist, i, array) => (
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
