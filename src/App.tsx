// import "./auth/auth";
import Root from "./Root";
import Home from "./Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useStateStore } from "./state/store";
// import { useUserStore } from "./state/user";
// import { usePlaylistStore } from "./state/playlists";

function App() {
  const getUser = useStateStore((store) => store.getUser);
  const getPlaylists = useStateStore((store) => store.getPlaylists);
  // const initAuth = useAuthStore((store) => store.initAuth);

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
            await getPlaylists();
            return null;
          },
          children: [{}],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
