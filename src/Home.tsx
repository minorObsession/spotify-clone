import { NavLink } from "react-router-dom";
import { isUserAuthorized } from "./auth/auth";
import { useEffect } from "react";

function Home() {
  // ! clean up the url

  useEffect(() => {
    if (!isUserAuthorized) return;
    // Get current URL without query parameters
    const url = new URL(window.location.href);

    // If the URL has a 'code' parameter, remove it
    if (url.searchParams.has("code")) {
      url.searchParams.delete("code");

      // Use history.replaceState to update the URL without reloading the page
      window.history.replaceState({}, document.title, url.toString());
    }
  }, []);

  return (
    <div>
      <h1>homepage</h1>
      <NavLink to="/other">GO TO OTHER PAGE</NavLink>
    </div>
  );
}

export default Home;
