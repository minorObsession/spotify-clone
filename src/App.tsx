// import "./auth/auth";
import Root from "./Root";
import Home from "./Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthProvider from "./auth/AuthContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./state/store";
import { getUserAsync } from "./state/user/user";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "home",
          element: <Home />,
          loader: async () => {
            await dispatch(getUserAsync());
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
