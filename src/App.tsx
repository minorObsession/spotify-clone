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

// ! consolidate all icons in 1 place

// !debugging notes:
// !debugging notes:
// !debugging notes:
// !debugging notes:

// every loader running 4 times
//!  getUser and getUserPlaylists running normally - rendering 2 times
// it's not the useEffect in Home.tsx

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      loader: initialLoader,
      shouldRevalidate: () => false, // skip auto‑revalidation

      children: [
        {
          index: true,
          // auto redirect home
          loader: () => redirect("/home"),
          shouldRevalidate: () => false, // skip auto‑revalidation
        },
        {
          path: "home",
          element: <Home />,
          loader: userStateLoader,
          shouldRevalidate: () => false, // skip auto‑revalidation

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
