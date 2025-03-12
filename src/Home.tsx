import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./state/store";
import { getUserAsync } from "./state/user/user";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function Home() {
  const { isAuthenticated, logout } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  // const userPhoto = useSelector((state: RootState) => state.user.photo);

  // ! clean up the url if auth code is present in it
  useEffect(() => {
    if (!isAuthenticated) return;
    // Get current URL without query parameters
    const url = new URL(window.location.href);
    // If the URL has a 'code' parameter, remove it
    if (url.searchParams.has("code")) {
      url.searchParams.delete("code");

      // Use history.replaceState to update the URL without reloading the page
      window.history.replaceState({}, document.title, url.toString());
    }
  }, [isAuthenticated]);

  return (
    <div>
      <Header />
      <Sidebar />
      <main>
        <Outlet />
      </main>
      <button onClick={logout} className="">
        Logout
      </button>
      <button onClick={() => dispatch(getUserAsync())}>GET USER</button>
    </div>
  );
}

export default Home;
