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
import FullPreviewSearchResults, {
  searchLoader,
} from "./features/search/FPSearchResults";
import FullPreviewAlbum, { albumLoader } from "./features/albums/FPAlbum";
import FullPreviewPodcast, {
  podcastLoader,
} from "./features/podcasts/FPPodcast";
import FPFiltered from "./features/search/FPFiltered";

// TODO:

// ! NEED TO:
// ! NEED TO:
// ! NEED TO:
// THINK ABOUT ANCHORS TO POINT TO SPECIFIC PARTS OF SONGS!!

// !

// ! check search filters -not currently applying!
// ! WHEN TRACK IS SHORTER THAN 1 MIN, COLON SHOULDN'T BE DISPLAYED

// * DIFFERENT USER NOTES:

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
            {
              path: "search/:query",
              element: <FullPreviewSearchResults />,
              loader: searchLoader,
              children: [
                {
                  path: ":filter",
                  element: <FPFiltered />,
                },
              ],
            },
            {
              path: "album/:id",
              element: <FullPreviewAlbum />,
              loader: albumLoader,
            },
            {
              path: "podcast/:id",
              element: <FullPreviewPodcast />,
              loader: podcastLoader,
            },
            // {
            //   path: "episode/:id",
            //   element: <FullPreviewEpisode />,
            //   loader: episodeLoader,
            // },
            // {
            //   path: "audiobook/:id",
            //   element: <FullPreviewAudiobook />,
            //   loader: audiobookLoader,
            // },
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
