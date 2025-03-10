// import "./auth/auth";
import Root from "./Root";
import Home from "./Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Other from "./Other";
import AuthProvider from "./auth/AuthContext";
import ProtectedRoute from "./helpers/ProtectedRoute";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "home",
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: "other",
          element: (
            <ProtectedRoute>
              <Other />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />;
    </AuthProvider>
  );
}

export default App;
