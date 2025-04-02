import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./Root";
import Home, { initialStateLoader } from "./Home";
import { useStateStore } from "./state/store";
import FullPreviewPlaylist, {
  playlistLoader,
} from "./features/playlists/FullPreviewPlaylist";
import FullPreviewTrack, {
  trackLoader,
} from "./features/tracks/FullPreviewTrack";
import FullPreviewArtist, {
  artistLoader,
} from "./features/artists/FullPreviewArtist";

import PageNotFound from "./components/PageNotFound";

// TODO:
// ! add react query for some fetching!

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "home",
          element: <Home />,
          loader: initialStateLoader,
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
