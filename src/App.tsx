// import "./auth/auth";
import Root from "./Root";
import Home from "./Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useStateStore } from "./state/store";
import FullPreview, {
  loader as playlistLoader,
} from "./components/FullPreview";
import PageNotFound from "./components/PageNotFound";

// TODO:

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
