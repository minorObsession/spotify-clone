// ! ONLY FOR DESKTOP VIEW
import { useSelector } from "react-redux";
import { RootState } from "../state/store";
import UserPlaylist from "./UserPlaylist";

function Sidebar() {
  const playlists = useSelector((state: RootState) => state.user.playlists);
  console.log(playlists);
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
