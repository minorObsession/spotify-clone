import { SlSocialSpotify } from "react-icons/sl";
import { SlHome } from "react-icons/sl";

import { SlMagnifier } from "react-icons/sl";
import UserAvatar from "../../components/UserAvatar";
import { useNavigate } from "react-router";
import { useState } from "react";

function DesktopNav() {
  // ! automatically run getUser to get the photo WITH ROUTER LOADER
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    navigate(`/home/search/${query}`);
  };

  return (
    <menu
      className={`grid-nav-l flex h-12 w-screen items-center justify-between border-b-2 p-1.5 text-sm`}
    >
      {/* // ! spotify logo */}
      <SlSocialSpotify fill="red" size={20} className={``} />
      {/* <button onClick={() => navigate("playlist/37i9dQZF1E4uCelAIJhjih")}>
        GO TO PLAYLISTS
      </button> */}

      {/* // ! home-search div */}
      <div className="flex items-center justify-center gap-1 self-end">
        <SlHome
          fill="red"
          size={20}
          className="mr-3"
          onClick={() => navigate("/")}
        />
        {/* ! look up search element  */}
        <SlMagnifier fill="red" size={20} />
        <input
          type="text"
          placeholder="start searching..."
          className="translate-[0.095rem] rounded-2xl p-1.5"
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="rounded-full bg-green-700 px-3 py-1 text-sm"
          onClick={handleSearch}
        >
          GO
        </button>
      </div>

      {/* // ! user avatar div */}
      <UserAvatar inHeader={true} />
    </menu>
  );
}

export default DesktopNav;
