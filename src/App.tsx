import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";

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

// ! ROOT WONT' redirect("/home");!
// ! ROOT WONT' redirect("/home");!
// ! consolidate all icons in 1 place

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      loader: initialLoader,
      children: [
        {
          index: true,
          // auto redirect home
          loader: () => redirect("/home"),
        },
        {
          path: "home",
          element: <Home />,
          loader: userStateLoader, // This loader is only on the home route
          children: [
            {
              path: "playlist/:id",
              element: <FullPreviewPlaylist />,
              loader: playlistLoader, // This loader is only on the playlist route
            },
            {
              path: "track/:id",
              element: <FullPreviewTrack />,
              loader: trackLoader, // This loader is only on the track route
            },
            {
              path: "artist/:id",
              element: <FullPreviewArtist />,
              loader: artistLoader, // This loader is only on the artist route
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
