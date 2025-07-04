// src/stores/authStore.ts
import { StateCreator } from "zustand";
import { base64encode, generateRandomString, sha256 } from "./authHelpers";
import { StateStore, useStateStore } from "../../state/store";
import { initialEmptyPlaylist } from "../playlists/playlists";
import Cookies from "js-cookie";

// --- Configuration ---
const AUTH_CONFIG = {
  clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID as string,
  redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string,
  scope:
    "app-remote-control user-read-playback-state user-modify-playback-state user-read-currently-playing streaming user-read-playback-position user-read-email user-read-private user-library-read user-library-modify playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-follow-read user-follow-modify user-top-read user-read-recently-played ugc-image-upload",
  authUrl: "https://accounts.spotify.com/authorize",
  tokenUrl: "https://accounts.spotify.com/api/token",
};

// --- Types ---
export interface AccessTokenType {
  expiresAt: number;
  token: string;
  expiresAtDate?: string;
  now?: string;
}

export interface AuthSlice {
  isAuthenticated: boolean;
  refreshInterval: NodeJS.Timeout | null;
  initAuth: () => Promise<void>;
  logout: () => void;
  waitForAuthentication: () => Promise<boolean>;
  requestAuthCodeAndRedirect: () => Promise<void>;
  requestToken: (authCode: string, codeVerifier: string) => Promise<void>;
  autoRefreshToken: () => Promise<void>;
}

export const createAuthSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never], ["zustand/persist", unknown]],
  [],
  AuthSlice
> = (set, get) => ({
  isAuthenticated: (() => {
    // Check if token exists and is valid in spotify-clone-state-storage
    const existingAccessToken: AccessTokenType = JSON.parse(
      Cookies.get("accessToken") || "{}",
    );

    if (existingAccessToken?.token) {
      return existingAccessToken.expiresAt > Date.now();
    }
    return false;
  })(),

  refreshInterval: null,
  // --- Public Action: Initialize Auth Flow ---
  initAuth: async () => {
    // ! 1. Check localStorage for existing tokens

    const existingAccessToken: AccessTokenType = JSON.parse(
      Cookies.get("accessToken") || "{}",
    );
    const storedAccessToken = existingAccessToken?.token;
    const storedRefreshToken = Cookies.get("refreshToken");

    if (storedAccessToken && storedRefreshToken) {
      try {
        // Validate token expiry
        if (Date.now() < existingAccessToken.expiresAt) {
          set(
            {
              isAuthenticated: true,
            },
            undefined,
            "auth/setAuthFromStorage",
          );
          await get().autoRefreshToken();
        }
      } catch (error) {
        console.error("Error using stored access token", error);
      }
    }
    console.log("⏰ GONNA REDIRECT AND REQUEST");
    // 2. no tokens - Not authenticated: check if the URL contains an auth code
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");
    const storedCodeVerifier = localStorage.getItem("code_verifier");

    if (authCode && storedCodeVerifier) {
      console.log("🔑 AUTH CODE EXISTS, REQUESTING TOKENS");
      // Auth code exists, request tokens
      await get().requestToken(authCode, storedCodeVerifier);
      // Clean URL by removing auth code parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // 3. No auth code—initiate the auth request flow
      await get().requestAuthCodeAndRedirect();
    }
  },

  // --- Internal Action: Request Auth Code & Redirect ---
  requestAuthCodeAndRedirect: async () => {
    try {
      // Generate a code verifier and store it for later use
      const codeVerifier = generateRandomString(64);
      localStorage.setItem("code_verifier", codeVerifier);

      // Create a code challenge from the verifier
      const hashed = await sha256(codeVerifier);
      const codeChallenge = base64encode(hashed);

      // Build the Spotify authorization URL with required parameters
      const authUrl = new URL(AUTH_CONFIG.authUrl);
      const params = {
        response_type: "code",
        client_id: AUTH_CONFIG.clientId,
        scope: AUTH_CONFIG.scope,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        redirect_uri: AUTH_CONFIG.redirectUri,
      };
      authUrl.search = new URLSearchParams(params).toString();
      console.log("🔑 AUTH URL is gonna be set to: ", authUrl.toString());
      // Redirect to Spotify login page
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error("Error requesting auth code and redirecting", error);
    }
  },

  // --- Internal Action: Request Token Using Auth Code ---
  requestToken: async (authCode, codeVerifier) => {
    try {
      const response = await fetch(AUTH_CONFIG.tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: AUTH_CONFIG.clientId,
          grant_type: "authorization_code",
          code: authCode,
          redirect_uri: AUTH_CONFIG.redirectUri,
          code_verifier: codeVerifier,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Build the new access token object
        const newAccessToken: AccessTokenType = {
          token: data.access_token,
          expiresAt: Date.now() + data.expires_in * 1000,
          expiresAtDate: new Date(
            Date.now() + data.expires_in * 1000,
          ).toISOString(),
          now: new Date().toISOString(),
        };

        // Set secure cookies with proper expiration and security flags
        Cookies.set("accessToken", JSON.stringify(newAccessToken), {
          secure: true, // Only sent over HTTPS
          sameSite: "strict", // Prevents CSRF attacks
          expires: new Date(newAccessToken.expiresAt), // Expires when token expires
          path: "/", // Available across the entire site
        });

        // Refresh token typically has a longer lifespan (e.g., 1 year)
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        console.log("oneYearFromNow", oneYearFromNow);

        Cookies.set("refreshToken", data.refresh_token, {
          secure: true,
          sameSite: "strict",
          expires: oneYearFromNow,
          path: "/",
        });

        set(
          {
            isAuthenticated: true,
          },
          undefined,
          "auth/setAuthFromTokenRequest",
        );

        console.log("✅User authenticated successfully.");
        // Start auto–refresh interval
        await get().autoRefreshToken();
      }
    } catch (error) {
      console.error("🛑 🛑 Error requesting token:", error);
    }
  },

  // --- Internal Action: Auto–Refresh Token ---
  autoRefreshToken: async () => {
    let { refreshInterval } = get();
    if (refreshInterval) clearInterval(refreshInterval); // 🔁 prevent duplicate

    const interval = setInterval(
      async () => {
        const accessToken: AccessTokenType = JSON.parse(
          Cookies.get("accessToken") || "{}",
        );

        const refreshToken = Cookies.get("refreshToken");

        // If refresh token is missing but access token is still valid, initiate new auth flow
        if (
          !refreshToken &&
          accessToken?.token &&
          accessToken.expiresAt > Date.now()
        ) {
          console.log(
            "Refresh token missing but access token valid - initiating new auth flow",
          );
          await get().requestAuthCodeAndRedirect();
          return;
        }

        // If either token is missing and access token is expired, clear interval
        if (!accessToken?.token || !refreshToken) {
          clearInterval(interval);
          set(
            { refreshInterval: null },
            undefined,
            "auth/clearRefreshInterval",
          );
          return;
        }

        const safetyNetMinutes = 20; // refresh 20 minutes before expiry

        // ! if safety net is reached - refresh token request
        const minutesLeft = (+accessToken.expiresAt - Date.now()) / 1000 / 60;
        console.log(`Token expires in ${minutesLeft.toFixed(2)} minutes.`);

        if (minutesLeft <= safetyNetMinutes) {
          try {
            const response = await fetch(AUTH_CONFIG.tokenUrl, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_id: AUTH_CONFIG.clientId,
              }),
            });

            if (!response.ok) throw new Error("Refreshing token failed.");

            const data = await response.json();

            const newAccessToken: AccessTokenType = {
              token: data.access_token,
              expiresAt: Date.now() + data.expires_in * 1000,
              expiresAtDate: new Date(
                Date.now() + data.expires_in * 1000,
              ).toISOString(),
              now: new Date().toISOString(),
            };

            // Update access token cookie with new expiration
            Cookies.set("accessToken", JSON.stringify(newAccessToken), {
              secure: true,
              sameSite: "strict",
              expires: new Date(newAccessToken.expiresAt),
              path: "/",
            });

            // If we got a new refresh token, update it with long expiration
            if (data.refresh_token) {
              const oneYearFromNow = new Date();
              oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

              Cookies.set("refreshToken", data.refresh_token, {
                secure: true,
                sameSite: "strict",
                expires: oneYearFromNow,
                path: "/",
              });
            }

            console.log("✅ token successfully refreshed!");
          } catch (error) {
            console.error("❌ Error refreshing token:", error);
            // Optionally trigger a logout here on repeated failures
            // get().logout();
          }
        }
      },
      10 * 60 * 1000,
    ); // Check every 5 minutes

    set({ refreshInterval: interval }, undefined, "auth/setRefreshInterval");
  },

  waitForAuthentication: async () => {
    return new Promise((resolve) => {
      const checkAuth = () => {
        if (get().isAuthenticated) {
          clearInterval(intervalId);
          resolve(true);
        }
      };
      const intervalId = setInterval(checkAuth, 500);
    });
  },

  // --- Public Action: Logout ---
  logout: () => {
    // Clear existing interval if any
    const currentInterval = get().refreshInterval;
    if (currentInterval) {
      clearInterval(currentInterval);
    }

    // Clear auth state from Zustand persist
    set(
      {
        // Clear auth state

        isAuthenticated: false,
        refreshInterval: null,
        // Clear user data
        user: null,
        usersSavedTracks: null,
        // Clear playback state
        player: null,
        deviceId: null,
        playerState: null,
        isPlayerLoading: false,
        // Clear playlist state
        playlists: [],
        playlistNamesWithIds: [],
        playlistsFetched: false,
        playlist: initialEmptyPlaylist,
        // Clear podcast state
        likedEpisodes: [],
        // Clear search state
        searchResults: null,
      },
      undefined,
      "auth/logout",
    );
    // clear cookies
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    // Clear other user-related state
    const { cleanupPlayer, logoutUser, requestAuthCodeAndRedirect } =
      useStateStore.getState();

    cleanupPlayer();
    logoutUser();
    requestAuthCodeAndRedirect();
  },
});
