// ! ONLY FOR DESKTOP VIEW

import UserPlaylist from "../../features/playlists/UserPlaylist";
import { useStateStore } from "../../state/store";

//  ! SIDEBAR CAN CONTAIN MORE THAN PLAYLISTS!! ACCOUNT FOR THIS!!
//  ! SIDEBAR CAN CONTAIN MORE THAN PLAYLISTS!! ACCOUNT FOR THIS!!
//  ! SIDEBAR CAN CONTAIN MORE THAN PLAYLISTS!! ACCOUNT FOR THIS!!
function Sidebar() {
  const playlists = useStateStore((store) => store.playlists);
  const usersSavedTracks = useStateStore((store) => store.usersSavedTracks);

  if (!playlists) return null;
  return (
    <aside
      className={`grid-sidebar-l min-w-[20vw] overflow-y-auto bg-amber-600 p-2 py-5`}
    >
      {usersSavedTracks && (
        <UserPlaylist
          name={usersSavedTracks.name}
          id={usersSavedTracks.id}
          ownerName={`${usersSavedTracks.numTracks} liked songs`}
          imageUrl={usersSavedTracks.imageUrl}
          trackIds={usersSavedTracks.tracks.map((track) => track.id)}
        />
      )}
      {playlists?.map((playlist) => (
        <UserPlaylist
          id={playlist.id}
          name={playlist.name}
          key={playlist.id}
          imageUrl={playlist.imageUrl}
          ownerName={playlist.ownerName}
          trackIds={playlist.trackIds}
        />
      ))}
    </aside>
  );
}

export default Sidebar;
