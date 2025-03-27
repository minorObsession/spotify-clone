import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Sidebar from "./components/Sidebar";
import { useScreenWidthRem } from "./hooks/useScreenWidthRem";
import MobileNav from "./components/MobileNav";
import DesktopPlayback from "./components/DesktopPlayback";
import MobilePlayback from "./components/MobilePlayback";

import DesktopNav from "./components/DesktopNav";
import MobileHeader from "./components/MobileHeader";

import RecentlyPlayedMobile from "./components/RecentlyPlayedMobile";
import RecentlyPlayedDesktop from "./components/RecentlyPlayedDesktop";
import { useStateStore } from "./state/store";
import SuggestionsRow from "./components/SuggestionsRow";

function Home() {
  const isAuthenticated = useStateStore((store) => store.isAuthenticated);
  const { isLargeScreen } = useScreenWidthRem();
  const location = useLocation();

  const isHomepage = location.pathname === "/home";

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

  // ! LARGE SCREEN LAYOUT
  return isLargeScreen ? (
    <div className={`grid-layout-l overflow-hidden`}>
      <DesktopNav />
      <Sidebar />
      <main className="grid-main-l flex flex-col overflow-y-auto bg-blue-100 pb-5">
        {isHomepage ? (
          <>
            <RecentlyPlayedDesktop />
            <SuggestionsRow />
            {/* // ! suggestions - albums by artist you follow */}
            {/* // ! suggestions - audiobooks */}

            <SuggestionsRow />
          </>
        ) : (
          <Outlet />
        )}
      </main>
      <DesktopPlayback />
    </div>
  ) : (
    //  ! SMALL SCREEN LAYOUT
    <div className={`grid-layout-m h-screen w-screen overflow-x-hidden`}>
      <MobileHeader />
      <main>
        <RecentlyPlayedMobile />
        <Outlet />
      </main>
      <MobilePlayback />
      <MobileNav />
    </div>
  );
}

export default Home;
