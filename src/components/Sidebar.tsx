// ! ONLY FOR DESKTOP VIEW
import UserPlaylist from "./UserPlaylist";
import { usePlaylistStore } from "../state_z/playlists";

function Sidebar() {
  const playlists = usePlaylistStore((store) => store.playlists);
  // console.log(playlists);
  // if (!playlists) return null;

  return (
    <aside className={`overflow-y-scroll bg-amber-600 p-2`}>
      {playlists.map((playlist) => (
        <UserPlaylist
          id={playlist.id}
          name={playlist.name}
          key={playlist.id}
          images={playlist.images}
        />
      ))}
    </aside>
  );
}

export default Sidebar;
