// src/stores/authStore.ts
import { StateCreator } from "zustand";
import { base64encode, generateRandomString, sha256 } from "./authHelpers";
import { StateStore, useStateStore } from "../../state/store";

// --- Configuration ---
const AUTH_CONFIG = {
  clientId: "91915dd042e1406aa1ca2fef874d5e1b",
  redirectUri: "http://127.0.0.1:5173/home",
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
  accessToken: AccessTokenType | null;
  refreshToken: string | null;
  refreshInterval: NodeJS.Timeout | null;
  initAuth: () => Promise<void>;
  logout: () => void;
  waitForAuthentication: () => Promise<boolean>;
  requestAuthCodeAndRedirect: () => Promise<void>;
  requestToken: (authCode: string, codeVerifier: string) => Promise<void>;
  autoRefreshToken: () => Promise<void>;
}

let hasFetchedToken = false;

export const createAuthSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  AuthSlice
> = (set, get) => ({
  isAuthenticated: Boolean(
    localStorage.getItem("access_token") &&
      (() => {
        try {
          const token: AccessTokenType = JSON.parse(
            localStorage.getItem("access_token") || "{}",
          );
          return token.expiresAt > Date.now();
        } catch {
          return false;
        }
      })(),
  ),
  accessToken: localStorage.getItem("access_token")
    ? JSON.parse(localStorage.getItem("access_token")!)
    : null,
  refreshToken: localStorage.getItem("refresh_token"),
  refreshInterval: null,
  // --- Public Action: Initialize Auth Flow ---
  initAuth: async () => {
    if (hasFetchedToken) return;
    hasFetchedToken = true;

    console.log("initAuth called...passed the flag");
    // ! 1. Check localStorage for existing tokens
    const storedAccessTokenString = localStorage.getItem("access_token");
    const storedRefreshToken = localStorage.getItem("refresh_token");

    if (storedAccessTokenString && storedRefreshToken) {
      try {
        const accessToken: AccessTokenType = JSON.parse(
          storedAccessTokenString,
        );
        // ! Validate token expiry
        if (Date.now() < accessToken.expiresAt) {
          set({
            accessToken,
            refreshToken: storedRefreshToken,
            isAuthenticated: true,
          });
          // ! Start auto–refresh interval
          get().autoRefreshToken();
        }
      } catch (error) {
        console.error("Error parsing stored access token", error);
      }
    }

    // 2. no tokens - Not authenticated: check if the URL contains an auth code
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");
    const storedCodeVerifier = localStorage.getItem("code_verifier");

    if (authCode && storedCodeVerifier) {
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
    console.log("requestAuthCodeAndRedirect called");
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

    // Redirect to Spotify login page
    window.location.href = authUrl.toString();
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
        // Persist tokens in localStorage
        localStorage.setItem("access_token", JSON.stringify(newAccessToken));
        localStorage.setItem("refresh_token", data.refresh_token);
        set({
          accessToken: newAccessToken,
          refreshToken: data.refresh_token,
          isAuthenticated: true,
        });

        console.log("User authenticated successfully.");
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

    const interval = setInterval(async () => {
      const { accessToken, refreshToken } = get();
      if (!accessToken || !refreshToken) {
        clearInterval(interval);
        set({ refreshInterval: null });
        return;
      }

      const safetyNetMinutes = 20; // refresh 20 minutes before expiry

      // ! if safetuy net is reached - refresh token request
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
          const data = await response.json();
          if (response.ok) {
            const newAccessToken: AccessTokenType = {
              token: data.access_token,
              expiresAt: Date.now() + data.expires_in * 1000,
              expiresAtDate: new Date(
                Date.now() + data.expires_in * 1000,
              ).toISOString(),
              now: new Date().toISOString(),
            };
            localStorage.setItem(
              "access_token",
              JSON.stringify(newAccessToken),
            );
            // Use the new refresh token if provided, otherwise keep the old one
            if (data.refresh_token) {
              localStorage.setItem("refresh_token", data.refresh_token);
              set({ refreshToken: data.refresh_token });
            }
            set({
              accessToken: newAccessToken,
              refreshToken: data.refresh_token || refreshToken,
              isAuthenticated: true,
            });

            console.log("token successfully refreshed!");
          } else {
            throw new Error("Refreshing token failed.");
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          // Optionally trigger a logout here on repeated failures
          // get().logout();
        }
      }
    }, 60000 * 10); // ! Check every 10 minutes

    // set refresh interval state
    set({ refreshInterval: interval });
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
    console.log("logout called");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("code_verifier");

    set({ accessToken: null, refreshToken: null, isAuthenticated: false });
    const { cleanupPlayer, logoutUser } = useStateStore.getState();
    cleanupPlayer();
    logoutUser();
    // Optionally, redirect the user to a public page
    window.location.href = "/";
    get().initAuth();
  },
});
