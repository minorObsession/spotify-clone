import { Outlet } from "react-router-dom";
import { useEffect } from "react";

import Sidebar from "./components/Sidebar";
import { useScreenWidthRem } from "./hooks/useScreenWidthRem";
import MobileNav from "./components/MobileNav";
import DesktopPlayback from "./components/DesktopPlayback";
import MobilePlayback from "./components/MobilePlayback";

import DesktopNav from "./components/DesktopNav";
import MobileHeader from "./components/MobileHeader";

// import { useAuthStore } from "./state/Auth.z";
import RecentlyPlayedMobile from "./components/RecentlyPlayedMobile";
import RecentlyPlayedDesktop from "./components/RecentlyPlayedDesktop";
import { useStateStore } from "./state/store";
import Thumbnail from "./components/Thumbnail";

function Home() {
  // const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const isAuthenticated = useStateStore((store) => store.isAuthenticated);
  const username = useStateStore((store) => store.username);

  const { isLargeScreen } = useScreenWidthRem();

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
    <div className={`grid-layout-l h-screen w-screen overflow-x-hidden`}>
      <DesktopNav />
      <Sidebar />
      <main className="flex flex-col">
        <RecentlyPlayedDesktop />
        {/* // ! suggestions */}
        <div className="p-2">
          <h2 className="">Made for {username}</h2>
          {/* // ! suggestions container */}
          <div className="sw-full flex gap-5 overflow-x-scroll">
            {/* // ! SUGGSTED CARD */}
            <div className="flex w-40 flex-col gap-2 border-1 p-1">
              <div className="">
                <Thumbnail
                  img="https://mosaic.scdn.co/640/ab67616d00001e024ca68d59a4a29c856a4a39c2ab67616d00001e025fd7c284c0b719ad07b8eac2ab67616d00001e0270b88fc5a2e13bc5440d947cab67616d00001e029e1cfc756886ac782e363d79"
                  width="w-[100%]"
                />
              </div>
              <p className="truncate">
                artists display long saguyfagafsgfajfgjfasgasgfasgf
              </p>
            </div>
            {/* // ! SUGGSTED CARD */}
            <div className="flex w-40 flex-col gap-2 border-1 p-1">
              <div className="">
                <Thumbnail
                  img="https://mosaic.scdn.co/640/ab67616d00001e024ca68d59a4a29c856a4a39c2ab67616d00001e025fd7c284c0b719ad07b8eac2ab67616d00001e0270b88fc5a2e13bc5440d947cab67616d00001e029e1cfc756886ac782e363d79"
                  width="w-[100%]"
                />
              </div>
              <p className="truncate">
                artists display long saguyfagafsgfajfgjfasgasgfasgf
              </p>
            </div>
            {/* // ! SUGGSTED CARD */}
            <div className="flex w-40 flex-col gap-2 border-1 p-1">
              <div className="">
                <Thumbnail
                  img="https://mosaic.scdn.co/640/ab67616d00001e024ca68d59a4a29c856a4a39c2ab67616d00001e025fd7c284c0b719ad07b8eac2ab67616d00001e0270b88fc5a2e13bc5440d947cab67616d00001e029e1cfc756886ac782e363d79"
                  width="w-[100%]"
                />
              </div>
              <p className="truncate">
                artists display long saguyfagafsgfajfgjfasgasgfasgf
              </p>
            </div>
            {/* // ! SUGGSTED CARD */}
            <div className="flex w-40 flex-col gap-2 border-1 p-1">
              <div className="">
                <Thumbnail
                  img="https://mosaic.scdn.co/640/ab67616d00001e024ca68d59a4a29c856a4a39c2ab67616d00001e025fd7c284c0b719ad07b8eac2ab67616d00001e0270b88fc5a2e13bc5440d947cab67616d00001e029e1cfc756886ac782e363d79"
                  width="w-[100%]"
                />
              </div>
              <p className="truncate">
                artists display long saguyfagafsgfajfgjfasgasgfasgf
              </p>
            </div>
            {/* // ! SUGGSTED CARD */}
            <div className="flex w-40 flex-col gap-2 border-1 p-1">
              <div className="">
                <Thumbnail
                  img="https://mosaic.scdn.co/640/ab67616d00001e024ca68d59a4a29c856a4a39c2ab67616d00001e025fd7c284c0b719ad07b8eac2ab67616d00001e0270b88fc5a2e13bc5440d947cab67616d00001e029e1cfc756886ac782e363d79"
                  width="w-[100%]"
                />
              </div>
              <p className="truncate">
                artists display long saguyfagafsgfajfgjfasgasgfasgf
              </p>
            </div>

            {/* // ! SUGGSTED CARD */}
            <div className="flex w-40 flex-col gap-2 border-1 p-1">
              <div className="">
                <Thumbnail
                  img="https://mosaic.scdn.co/640/ab67616d00001e024ca68d59a4a29c856a4a39c2ab67616d00001e025fd7c284c0b719ad07b8eac2ab67616d00001e0270b88fc5a2e13bc5440d947cab67616d00001e029e1cfc756886ac782e363d79"
                  width="w-[100%]"
                />
              </div>
              <p className="truncate">
                artists display long saguyfagafsgfajfgjfasgasgfasgf
              </p>
            </div>
            {/* // ! SUGGSTED CARD */}
            <div className="flex w-40 flex-col gap-2 border-1 p-1">
              <div className="">
                <Thumbnail
                  img="https://mosaic.scdn.co/640/ab67616d00001e024ca68d59a4a29c856a4a39c2ab67616d00001e025fd7c284c0b719ad07b8eac2ab67616d00001e0270b88fc5a2e13bc5440d947cab67616d00001e029e1cfc756886ac782e363d79"
                  width="w-[100%]"
                />
              </div>
              <p className="truncate">
                artists display long saguyfagafsgfajfgjfasgasgfasgf
              </p>
            </div>
          </div>
        </div>

        {/* // ! new releases */}
        <div className="p-2">R</div>
        <Outlet />
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
