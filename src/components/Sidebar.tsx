// ! ONLY FOR DESKTOP VIEW

import { useStateStore } from "../state/store";
import UserPlaylist from "./UserPlaylist";

function Sidebar() {
  const playlists = useStateStore((store) => store.playlists);
  if (!playlists) return null;

  return (
    <aside
      className={`h-screen min-w-[20vw] overflow-y-scroll bg-amber-600 p-2`}
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
