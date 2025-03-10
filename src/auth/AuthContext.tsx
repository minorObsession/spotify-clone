// src/auth/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { base64encode, generateRandomString, sha256 } from "./authHelpers";

// Configuration
const AUTH_CONFIG = {
  clientId: "91915dd042e1406aa1ca2fef874d5e1b",
  redirectUri: "http://127.0.0.1:5173/home",
  scope: "user-read-private user-read-email",
  authUrl: "https://accounts.spotify.com/authorize",
  tokenUrl: "https://accounts.spotify.com/api/token",
};

// Type definitions
interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  logout: () => void;
  isLoading: boolean;
}

// Create context with default values (why   logout: () => {} ???? )
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  logout: () => {},
  isLoading: true,
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("access_token") || null
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refresh_token") || null
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    (accessToken && refreshToken && true) || false
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ! codeVerifier and authCode intentionally not state!
  const codeVerifier = localStorage.getItem("code_verifier") || null;

  let authCode = useRef(
    codeVerifier
      ? new URLSearchParams(window.location.search).get("code")
      : null
  );

  // ! Login auth Step 1: CHECK LOCAL STORAGE, IF NO TOKEN THEN REQUEST AUTH CODE
  useEffect(() => {
    if (isAuthenticated) {
      console.log("USER isAuthenticated ✅ NOT GONNA START initializeAuth");
      return;
    }

    async function initializeAuth() {
      try {
        setIsLoading(true);

        // Check for stored tokens first
        const storedAccessToken = localStorage.getItem("access_token");
        const storedRefreshToken = localStorage.getItem("refresh_token");

        if (storedAccessToken) {
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          setIsAuthenticated(true);
          console.log(
            "✅ USER IS Authenticated! the requestAuthCodeAndRedirect will never run !!"
          );
          return;
        }

        // ! if no token in LS
        await requestAuthCodeAndRedirect();
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
        console.log("step1 effect finished");
      }
    }

    async function requestAuthCodeAndRedirect() {
      if (isAuthenticated) {
        console.log("✅ ALREADY AUTHENTICATED ");
        return;
      }

      if (authCode.current !== null) {
        console.log(
          "authCode exists so no need to request it.. authCode:",
          authCode
        );
        return;
      }

      // Generate code challenge from the verifier
      const codeVerifier = generateRandomString(64);
      window.localStorage.setItem("code_verifier", codeVerifier);
      const hashed = await sha256(codeVerifier);
      const codeChallenge = base64encode(hashed);

      // Build authorization URL
      const authUrl = new URL("https://accounts.spotify.com/authorize");
      const params = {
        response_type: "code",
        client_id: AUTH_CONFIG.clientId,
        scope: AUTH_CONFIG.scope,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        redirect_uri: AUTH_CONFIG.redirectUri,
      };

      // Append params to URL and then redirect
      authUrl.search = new URLSearchParams(params).toString();
      console.log("Redirecting to Spotify login...");
      window.location.href = authUrl.toString();
    }

    initializeAuth();
  }, [isAuthenticated, accessToken, refreshToken]);

  // ! Login auth Step 2: RETRIEVE AUTH CODE FROM URL THEN REQUEST TOKEN
  useEffect(() => {
    if (isAuthenticated || !codeVerifier || authCode.current === null) {
      console.log(
        "STOPPING STEP 2:",
        "isAuthenticated:",
        isAuthenticated === true && "✅",
        "authCode:",
        authCode.current
      );
      return;
    }

    requestToken(authCode.current, codeVerifier);

    // Token request function
    async function requestToken(authCode: string, codeVerifier: string) {
      if (isAuthenticated) return;
      try {
        console.log("requestToken running...");
        const response = await fetch(AUTH_CONFIG.tokenUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
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
          localStorage.setItem(
            "access_token",
            JSON.stringify({
              token: data.access_token,
              expiresAt: Date.now() + data.expires_in * 1000,
            })
          );
          localStorage.setItem("refresh_token", data.refresh_token);
          setAccessToken(data.access_token);
          setRefreshToken(data.refresh_token);
          setIsAuthenticated(true);
          console.log(
            "✅ both tokens successfully stored - user authenticated"
          );
        } else {
          console.error("Authentication failed:", data);
          // logout();
        }
      } catch (error) {
        console.error("Error requesting token:", error);
        // logout();
      }
    }
  }, [isAuthenticated, codeVerifier, accessToken]);

  useEffect(() => {
    const safetyNetForRefresh = 59 * 60 * 1000; // 59 minutes
    let accessTokenExpiresAt: number;

    const accessTokenRaw = localStorage.getItem("access_token");
    if (accessTokenRaw !== null) {
      accessTokenExpiresAt = JSON.parse(accessTokenRaw);
      console.log(accessTokenExpiresAt);
    } else {
      console.log("No access token found in localStorage.");
    }

    // ! need to subscribe to currentTime
    // debugger;

    // ! every 30s check access token against currentTime
    setInterval(() => {
      const minutesLeft =
        (accessTokenExpiresAt - Date.now() - safetyNetForRefresh) / 1000 / 60;
      console.log("minuteLeft:", minutesLeft);
      if (accessTokenExpiresAt && minutesLeft < 10) {
        // ! run refresh fn
        console.log("run refresh");
      }
    }, 30000);
    // ! 59 min earlier, refresh token
  }, []);
  // async function autoRefreshToken(params: type) {
  //   // refresh token that has been previously stored
  //   const refreshToken = localStorage.getItem("refresh_token");
  //   const url = "https://accounts.spotify.com/api/token";

  //   const payload = {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     body: new URLSearchParams({
  //       grant_type: "refresh_token",
  //       refresh_token: refreshToken,
  //       client_id: clientId,
  //     }),
  //   };
  //   const body = await fetch(AUTH_CONFIG.tokenUrl, payload);
  //   const response = await body.json();

  //   localStorage.setItem("access_token", response.accessToken);
  //   if (response.refreshToken) {
  //     localStorage.setItem("refresh_token", response.refreshToken);
  //   }
  // }

  // Logout function

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("code_verifier");
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    authCode.current = null;
  };

  // Context value
  const contextValueObject: AuthContextType = {
    isAuthenticated,
    accessToken,
    refreshToken,
    // login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValueObject}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
