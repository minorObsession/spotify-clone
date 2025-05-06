import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Root, { initialLoader } from "./Root";
import Home, { userStateLoader } from "./Home";
import FullPreviewPlaylist, {
  playlistLoader,
} from "./features/playlists/FPPlaylist";
import FullPreviewTrack, {
  trackLoader,
} from "./features/tracks/FPPlaylistTrack";
import FullPreviewArtist, { artistLoader } from "./features/artists/FPArtist";

import PageNotFound from "./components/PageNotFound";

// TODO:

// * DIFFERENT USER NOTES:

// ! while in playlists/track screen, the auto refresh won't refresh token!!!!
// ! consolidate all icons in 1 place

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      loader: initialLoader,
      children: [
        {
          path: "home",
          element: <Home />,
          loader: userStateLoader,
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
