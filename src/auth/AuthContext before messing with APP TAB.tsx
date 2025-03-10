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
  login?: () => Promise<void>;
  logout?: () => void;
  isLoading: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  login: async () => {},
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

  const codeVerifier = localStorage.getItem("code_verifier") || null;

  let authCode = useRef(
    codeVerifier
      ? new URLSearchParams(window.location.search).get("code")
      : null
  );

  // ! TO READ AUTH CODE FORM URL
  useEffect(() => {
    if (isAuthenticated) return;

    const isCodePresentInUrl: boolean = new URLSearchParams(
      window.location.search
    ).get("code")
      ? true
      : false;

    if (isCodePresentInUrl)
      authCode.current = new URLSearchParams(window.location.search).get(
        "code"
      );
  }, [isAuthenticated]);

  // Token request function
  async function requestToken(authCode: string, codeVerifier: string) {
    console.log("requestToken running...");

    try {
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
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        setAccessToken(data.access_token);
        setRefreshToken(data.refresh_token);
        setIsAuthenticated(true);
        console.log("✅ both tokens successfully stored - user authenticated");
        return true;
      } else {
        console.error("Authentication failed:", data);
        // logout();
        return false;
      }
    } catch (error) {
      console.error("Error requesting token:", error);
      // logout();
      return false;
    }
  }

  // ! Step 1: CHECK LOCAL STORAGE, IF NO TOKEN THEN REQUEST AUTH CODE
  useEffect(() => {
    // authCode.current = null;
    if (isAuthenticated) {
      console.log("USER isAuthenticated ✅ NOT GONNA START initializeAuth");
      return;
    } else {
      // console.log('user NOT authenticated.. mocing ')
    }
    async function requestAuthCodeAndRedirect() {
      if (isAuthenticated || accessToken || refreshToken) {
        console.log("✅ ALREADY AUTHENTICATED ");
        return;
      }

      if (authCode.current !== null) {
        console.log("authCode:", authCode);
        return;
      }

      // Generate code challenge from the verifier
      const codeVerifier = generateRandomString(64);
      window.localStorage.setItem("code_verifier", codeVerifier);
      window.sessionStorage.setItem("code_verifier", codeVerifier);
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
          console.log("✅ USER IS Authenticated!!!");
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

    initializeAuth();
  }, [isAuthenticated, accessToken, refreshToken]);

  // ! Step 2: RETRIEVE AUTH CODE FROM URL THEN REQUEST TOKEN
  useEffect(() => {
    if (isAuthenticated || !codeVerifier || authCode.current === null) {
      console.log(
        "STOPPING STEP 2:",
        "isAuthenticated:",
        isAuthenticated === true && "✅"
      );
      return;
    }
    if (authCode.current !== null && typeof authCode.current === "string") {
      console.log("starting the token request..");
      requestToken(authCode.current, codeVerifier);
    }
  }, [authCode, isAuthenticated, codeVerifier]);

  // Login function

  // const login = async () => {
  //   console.log("login running");
  //   try {
  //     // Generate and store verifier
  //     const codeVerifier = generateRandomString(64);
  //     localStorage.setItem("code_verifier", codeVerifier);

  //     // Generate challenge
  //     const hashed = await sha256(codeVerifier);
  //     const codeChallenge = base64encode(hashed);

  //     // Build auth URL
  //     const authUrl = new URL(AUTH_CONFIG.authUrl);
  //     const params = {
  //       response_type: "code",
  //       client_id: AUTH_CONFIG.clientId,
  //       scope: AUTH_CONFIG.scope,
  //       code_challenge_method: "S256",
  //       code_challenge: codeChallenge,
  //       redirect_uri: AUTH_CONFIG.redirectUri,
  //     };

  //     // Redirect to Spotify login
  //     authUrl.search = new URLSearchParams(params).toString();
  //     setTimeout(() => {
  //       window.location.href = authUrl.toString();
  //     }, 5000);
  //   } catch (error) {
  //     console.error("Login error:", error);
  //   }
  // };

  // // Logout function
  // const logout = () => {
  //   localStorage.removeItem("access_token");
  //   localStorage.removeItem("refresh_token");
  //   localStorage.removeItem("code_verifier");
  //   setAccessToken(null);
  //   setRefreshToken(null);
  //   setIsAuthenticated(false);
  // };

  // Context value
  const contextValueObject: AuthContextType = {
    isAuthenticated,
    accessToken,
    refreshToken,
    // login,
    // logout,
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
