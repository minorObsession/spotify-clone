import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root from "./Root";
import Home, { initialStateLoader } from "./Home";
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
              path: "playlist/:id",
              element: <FullPreviewPlaylist />,
              loader: playlistLoader,
            },
            {
              path: "track/:id",
              element: <FullPreviewTrack />,
              loader: trackLoader,
            },
            {
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
