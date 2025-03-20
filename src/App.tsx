// import "./auth/auth";
import Root from "./Root";
import Home from "./Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useStateStore } from "./state/store";
import FullPreview, {
  loader as playlistLoader,
} from "./components/FullPreview";
import PageNotFound from "./components/PageNotFound";
// import { useUserStore } from "./state/user";
// import { usePlaylistStore } from "./state/playlists";

function App() {
  const getUser = useStateStore((store) => store.getUser);
  const getUserPlaylists = useStateStore((store) => store.getUserPlaylists);

  // ! FULL PREVIEW:

  // user click on playlist
  // url changes playlist:ID
  // redirect to main --> home/playlist
  // read URL to start api request
  // loading spinner
  // content displays in main BASED ON URL

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "home",
          element: <Home />,
          loader: async () => {
            await getUser();
            await getUserPlaylists();
            return null;
          },
          children: [
            {
              // ! also could be album or show (audiobook or podcast)
              path: "playlist/:id",
              element: <FullPreview />,
              loader: playlistLoader,
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
