import { useEffect, useState } from "react";
import { useStateStore } from "../state/store";
import { DetailedPlaylistType } from "../features/playlists/playlists";

export function useReactivePlaylist(initialPlaylist: DetailedPlaylistType) {
  const [updatedPlaylist, setUpdatedPlaylist] = useState(initialPlaylist);
  const getPlaylist = useStateStore.getState().getPlaylist;

  // 🧠 Sync local state when loader data (initialPlaylist) changes
  useEffect(() => {
    setUpdatedPlaylist(initialPlaylist);
  }, [initialPlaylist]);

  const refreshPlaylist = async () => {
    console.log("refresh called...");
    const newData = await getPlaylist(updatedPlaylist.id, 0, true);
    if (newData) setUpdatedPlaylist(newData);
  };

  return {
    updatedPlaylist,
    setUpdatedPlaylist,
    refreshPlaylist,
  };
}
