import { Outlet } from "react-router-dom";
import { useEffect } from "react";

import Sidebar from "./components/Sidebar";
import { useScreenWidthRem } from "./hooks/useScreenWidthRem";
import MobileNav from "./components/MobileNav";
import DesktopPlayback from "./components/DesktopPlayback";
import MobilePlayback from "./components/MobilePlayback";

import DesktopNav from "./components/DesktopNav";
import MobileHeader from "./components/MobileHeader";
import RecentlyPlayed from "./components/RecentlyPlayed";
import { useAuthStore } from "./auth/Auth.z";

function Home() {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const { isLargeScreen } = useScreenWidthRem();

  // // ! clean up the url if auth code is present in it
  // useEffect(() => {
  //   if (!isAuthenticated) return;
  //   // Get current URL without query parameters
  //   const url = new URL(window.location.href);
  //   // If the URL has a 'code' parameter, remove it
  //   if (url.searchParams.has("code")) {
  //     url.searchParams.delete("code");

  //     // Use history.replaceState to update the URL without reloading the page
  //     window.history.replaceState({}, document.title, url.toString());
  //   }
  // }, [isAuthenticated]);

  // ! LARGE SCREEN LAYOUT
  return isLargeScreen ? (
    <div className={`grid-layout-l h-screen w-screen overflow-x-hidden`}>
      <DesktopNav />
      <Sidebar />
      <main className="">
        <RecentlyPlayed />
        <Outlet />
      </main>
      <DesktopPlayback />
    </div>
  ) : (
    //  ! SMALL SCREEN LAYOUT
    <div className={`grid-layout-m h-screen w-screen overflow-x-hidden`}>
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
