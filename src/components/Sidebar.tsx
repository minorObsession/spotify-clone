// ! ONLY FOR DESKTOP VIEW
// import UserPlaylist from "./UserPlaylist";
// import { usePlaylistStore } from "../state/playlists";
import { useStateStore } from "../state/store";
import UserPlaylist from "./UserPlaylist";

function Sidebar() {
  // const playlists = usePlaylistStore((store) => store.playlists);
  const playlists = useStateStore((store) => store.playlists);
  // console.log(playlists);
  // console.log(playlists);
  if (!playlists) return null;

  return (
    <aside
      className={`h-screen min-w-[20vw] overflow-y-scroll bg-amber-600 p-2`}
    >
      {playlists.map((playlist) => (
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
