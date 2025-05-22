import Thumbnail from "../../components/Thumbnail";
import { useStateStore } from "../../state/store";
import { CurrentTrack } from "../../layouts/desktop/DesktopPlayback";
import ArtistList, { Artist } from "../../components/ArtistList";

interface CurrentlyPlayngProps {
  currentTrack: CurrentTrack;
}

function CurrentlyPlayng({ currentTrack }: CurrentlyPlayngProps) {
  const { playerState } = useStateStore((state) => state);

  if (!playerState) return null;

  return (
    <div className="playlist-item max-w-[30%] flex-1 gap-x-4">
      <Thumbnail minWidth="w-12" img={currentTrack.trackImg || ""} />
      <p className="playlist-title">{currentTrack.trackName}</p>
      {currentTrack.artistsArr && (
        <p>
          <ArtistList
            artists={currentTrack.artistsArr as unknown as Artist[]}
            addClassName="playlist-owner"
          />
        </p>
      )}
    </div>
  );
}

export default CurrentlyPlayng;
