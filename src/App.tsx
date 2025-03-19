// import "./auth/auth";
import Root from "./Root";
import Home from "./Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useUserStore } from "./state_z/user";
import { usePlaylistStore } from "./state_z/playlists";

function App() {
  const getUser = useUserStore((store) => store.getUser);
  const getPlaylists = usePlaylistStore((store) => store.getPlaylists);
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
