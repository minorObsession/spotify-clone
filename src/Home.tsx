import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./state/store";
import { getUserAsync } from "./state/user/user";
import DesktopNav from "./components/DesktopNav";
import Sidebar from "./components/Sidebar";
import { useScreenWidthRem } from "./hooks/useScreenWidthRem";
import MobileNav from "./components/MobileNav";
import DesktopPlayback from "./components/DesktopPlayback";
import MobilePlayback from "./components/MobilePlayback";
import MobileHeader from "./components/MobileHeader";
import RecTabs from "./components/MobileHeaderTabs";
import RecentlyPlayed from "./components/RecentlyPlayed";

function Home() {
  const { isAuthenticated, logout } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { isLargeScreen } = useScreenWidthRem();

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

  // ! TWO RETURN BLOCKS DEPENING ON SCREEN SIZE???

  // ! LARGE SCREEN LAYOUT
  return isLargeScreen ? (
    <div className={`grid-layout-l h-screen w-screen`}>
      <DesktopNav />
      <Sidebar />
      <main>
        <h1>main element</h1>
        <Outlet />
        RecTabs
      </main>
      <DesktopPlayback />
    </div>
  ) : (
    //  ! SMALL SCREEN LAYOUT
    <div className={`grid-layout-m h-screen w-screen`}>
      <MobileHeader />
      <main>
        <RecentlyPlayed />
        <Outlet />
      </main>
      <MobilePlayback />
      <MobileNav />
    </div>
  );
}

export default Home;
{
  /* <button onClick={logout} className="">
        Logout
      </button>
      <button onClick={() => dispatch(getUserAsync())}>GET USER</button> */
}
