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
// in order to not mx out api - local storage of user playlists and all other stuff with username in key as well

// ! while in playlists/track screen, the auto refresh won't refresh token!!!!
// ! consolidate all icons in 1 place
// ! in 'liked' - clicking doens't work - error - no id to url

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
