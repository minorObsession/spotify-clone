// src/stores/authStore.ts
import { StateCreator } from "zustand";
import {
  base64encode,
  generateRandomString,
  sha256,
  getFromLocalStorage,
  saveToLocalStorage,
} from "./authHelpers";
import { StateStore, useStateStore } from "../../state/store";
import { AUTH_CONFIG } from "./config";

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
  token: string;
  expiresAt: number;
  expiresAtDate: string;
  now: string;
}

export interface AuthSlice {
  isAuthenticated: boolean;
  accessToken: AccessTokenType | null;
  refreshToken: string | null;
  refreshInterval: NodeJS.Timer | null;
  initAuth: () => Promise<void>;
  logout: () => void;
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
    getFromLocalStorage("access_token") &&
      (() => {
        try {
          const token: AccessTokenType = JSON.parse(
            getFromLocalStorage("access_token") || "{}",
          );
          return token.expiresAt > Date.now();
        } catch {
          return false;
        }
      })(),
  ),
  accessToken: getFromLocalStorage("access_token")
    ? JSON.parse(getFromLocalStorage("access_token")!)
    : null,
  refreshToken: getFromLocalStorage("refresh_token"),
  refreshInterval: null,

  // --- Public Action: Initialize Auth Flow ---
  initAuth: async () => {
    if (hasFetchedToken) return;
    hasFetchedToken = true;

    console.log("initAuth called...passed the flag");
    // ! 1. Check localStorage for existing tokens
    const storedAccessTokenString = getFromLocalStorage("access_token");
    const storedRefreshToken = getFromLocalStorage("refresh_token");

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
    const storedCodeVerifier = getFromLocalStorage("code_verifier");

    // ! 3. If we have an auth code and code verifier, request a token
    if (authCode && storedCodeVerifier) {
      await get().requestToken(authCode, storedCodeVerifier);
      // ! Clear the URL parameters
      window.history.replaceState({}, "", window.location.pathname);
    }
  },

  // --- Public Action: Start Auth Flow ---
  startAuthFlow: async () => {
    // ! 1. Generate code verifier and challenge
    const codeVerifier = generateRandomString(64);
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    // ! 2. Store code verifier for later use
    saveToLocalStorage("code_verifier", codeVerifier);

    // ! 3. Build authorization URL with code challenge
    const authUrl = new URL(AUTH_CONFIG.authUrl);
    authUrl.searchParams.append("client_id", AUTH_CONFIG.clientId);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("redirect_uri", AUTH_CONFIG.redirectUri);
    authUrl.searchParams.append("code_challenge_method", "S256");
    authUrl.searchParams.append("code_challenge", codeChallenge);
    authUrl.searchParams.append("scope", AUTH_CONFIG.scope);

    // ! 4. Redirect to authorization URL
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
        saveToLocalStorage("access_token", newAccessToken);
        saveToLocalStorage("refresh_token", data.refresh_token);
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
            saveToLocalStorage("access_token", newAccessToken);
            // Use the new refresh token if provided, otherwise keep the old one
            if (data.refresh_token) {
              saveToLocalStorage("refresh_token", data.refresh_token);
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

  // --- Public Action: Logout ---
  logout: () => {
    console.log("logout called");
    const { cleanupPlayer, logoutUser } = useStateStore.getState();
    cleanupPlayer();
    logoutUser();
    // Clear all auth-related data from localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("code_verifier");
    set({ accessToken: null, refreshToken: null, isAuthenticated: false });
    // Optionally, redirect the user to a public page
    window.location.href = "/";
  },
});
