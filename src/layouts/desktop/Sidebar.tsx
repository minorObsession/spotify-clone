// ! ONLY FOR DESKTOP VIEW

import UserPlaylist from "../../features/playlists/UserPlaylist";
import { useStateStore } from "../../state/store";

function Sidebar() {
  const playlists = useStateStore((store) => store.playlists);
  if (!playlists) return null;

  return (
    <aside
      className={`grid-sidebar-l min-w-[20vw] overflow-y-auto bg-amber-600 p-2 py-5`}
    >
      {playlists?.map((playlist) => (
        <UserPlaylist
          id={playlist.id}
          name={playlist.name}
          key={playlist.id}
          images={playlist.images}
          ownerName={playlist.ownerName}
        />
      ))}
    </aside>
  );
}

export default Sidebar;
