// import "./auth/auth";
import Root from "./Root";
import Home from "./Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthProvider from "./auth/AuthContext";

import { useUserStore } from "./state_z/user";
import { usePlaylistStore } from "./state_z/playlists";

function App() {
  // const dispatch = useDispatch<AppDispatch>();

  const getUser = useUserStore((store) => store.getUser);

  const getPlaylists = usePlaylistStore((store) => store.getPlaylists);

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

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
