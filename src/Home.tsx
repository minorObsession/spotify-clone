import { Outlet, useLocation } from "react-router-dom";
import { memo, useEffect } from "react";

import Sidebar from "./layouts/desktop/Sidebar";
import { useScreenWidthRem } from "./hooks/useScreenWidthRem";
import MobileNav from "./layouts/mobile/MobileNav";
import DesktopPlayback from "./layouts/desktop/DesktopPlayback";
import MobilePlayback from "./layouts/mobile/MobilePlayback";

import DesktopNav from "./layouts/desktop/DesktopNav";
import MobileHeader from "./layouts/mobile/MobileHeader";

import RecentlyPlayedMobile from "./layouts/mobile/RecentlyPlayedMobile";
import RecentlyPlayedDesktop from "./layouts/desktop/RecentlyPlayedDesktop";
import { useStateStore } from "./state/store";
// import SuggestionsRow from "./components/SuggestionsRow";

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
            {/* <SuggestionsRow /> */}
            {/* // ! suggestions - albums by artist you follow */}
            {/* // ! suggestions - audiobooks */}

            {/* <SuggestionsRow /> */}
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

export default memo(Home);

// ! syntetic solution - forcing only 1 execution of the loader... NOT GOOD LONG TERM!! MAYBE WORKS HERE BUT NOT FOR PLAYLISTS...
// let homeLoaderNumOfRuns = 0;
// const MAX_ALLOWED_CALLS = 1;

export const userStateLoader = async () => {
  // if (homeLoaderNumOfRuns >= MAX_ALLOWED_CALLS) {
  //   console.warn("⚠️ Too many userStateLoader calls! Skipping extra...");
  //   return null;
  // }
  // homeLoaderNumOfRuns++;
  // console.log(
  // `🔍 userStateLoader called from [${caller}] — run #${homeLoaderNumOfRuns}`,
  // );
  console.log("HOME LOADER RUNNING");
  const getUserPlaylists = useStateStore.getState().getUserPlaylists;
  const getUser = useStateStore.getState().getUser;
  const user = await getUser();

  console.log("👤 User from getUser():", user);
  if (!user) {
    console.error("❌ User is still null.. even after getUser() call");
    return null;
  } else {
    await getUserPlaylists();
  }

  return null;
};
