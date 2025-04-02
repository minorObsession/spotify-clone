import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./Root";
import Home from "./Home";

import { useStateStore } from "./state/store";

import FullPreviewPlaylist, {
  loader as playlistLoader,
} from "./features/playlists/FullPreviewPlaylist";
import FullPreviewTrack, {
  loader as trackLoader,
} from "./features/tracks/FullPreviewTrack";
import FullPreviewArtist, {
  loader as artistLoader,
} from "./features/artists/FullPreviewArtist";

import PageNotFound from "./components/PageNotFound";

// TODO:
// ! add react query for some fetching!

function App() {
  const getUser = useStateStore((store) => store.getUser);
  const getUserPlaylists = useStateStore((store) => store.getUserPlaylists);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "home",
          element: <Home />,
          // * this loader is kind of a "initStore" or "initApp" - maybe move it somewhere
          loader: async () => {
            await getUser();
            await getUserPlaylists();
            // await getRecTracks();
            return null;
          },
          children: [
            {
              // ! also could be album or show (audiobook or podcast)
              path: "playlist/:id",
              element: <FullPreviewPlaylist />,
              loader: playlistLoader,
            },
            {
              // ! also could be album or show (audiobook or podcast)
              path: "track/:id",
              element: <FullPreviewTrack />,
              loader: trackLoader,
            },
            {
              // ! also could be album or show (audiobook or podcast)
              path: "artist/:id",
              element: <FullPreviewArtist />,
              loader: artistLoader,
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
