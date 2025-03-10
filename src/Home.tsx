import { NavLink } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { useEffect } from "react";

function Home() {
  const { isAuthenticated, logout } = useAuth();

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
      <h1>homepage</h1>
      <NavLink to="/other">GO TO OTHER PAGE</NavLink>
      <button onClick={logout} className="">
        Logout
      </button>
    </div>
  );
}

export default Home;
