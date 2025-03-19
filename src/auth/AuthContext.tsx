// // src/auth/AuthContext.tsx
// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useRef,
// } from "react";
// import { base64encode, generateRandomString, sha256 } from "./authHelpers";

// // Configuration
// const AUTH_CONFIG = {
//   clientId: "91915dd042e1406aa1ca2fef874d5e1b",
//   redirectUri: "http://127.0.0.1:5173/home",
//   scope: "user-read-private user-read-email",
//   authUrl: "https://accounts.spotify.com/authorize",
//   tokenUrl: "https://accounts.spotify.com/api/token",
// };
// interface AccessTokenType {
//   expiresAtDate?: string;
//   now?: string;
//   expiresAt: number;
//   token: string;
// }

// // Type definitions
// interface AuthContextType {
//   isAuthenticated: boolean;
//   accessToken: AccessTokenType | null;
//   refreshToken: string | null;
//   logout: () => void;
// }

// // Create context with default values (why   logout: () => {} ???? )
// const AuthContext = createContext<AuthContextType>({
//   isAuthenticated: false,
//   accessToken: null,
//   refreshToken: null,
//   logout: () => {},
// });

// function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [accessToken, setAccessToken] = useState<AccessTokenType | null>(() => {
//     return JSON.parse(
//       localStorage.getItem("access_token") || "null",
//     ) as AccessTokenType | null;
//   });

//   const [refreshToken, setRefreshToken] = useState<string | null>(
//     localStorage.getItem("refresh_token") || null,
//   );
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
//     (accessToken && refreshToken && true) || false,
//   );

//   // ! codeVerifier and authCode intentionally not state!
//   const codeVerifier = localStorage.getItem("code_verifier") || null;

//   let authCode = useRef(
//     codeVerifier
//       ? new URLSearchParams(window.location.search).get("code")
//       : null,
//   );

//   // ! Login auth Step 1: CHECK LOCAL STORAGE, IF NO TOKEN THEN REQUEST AUTH CODE
//   useEffect(() => {
//     if (isAuthenticated) {
//       console.log("USER isAuthenticated ✅ NOT GONNA START ");
//       return;
//     }

//     async function requestAuthCodeAndRedirect() {
//       if (isAuthenticated) {
//         console.log("✅ ALREADY AUTHENTICATED ");
//         return;
//       }
//       console.log("...running requestAuthCodeAndRedirect →→→");

//       if (authCode.current !== null) {
//         console.log(
//           "authCode exists so no need to request it.. authCode:",
//           authCode,
//         );
//         return;
//       }

//       // Generate code challenge from the verifier
//       const codeVerifier = generateRandomString(64);
//       window.localStorage.setItem("code_verifier", codeVerifier);
//       const hashed = await sha256(codeVerifier);
//       const codeChallenge = base64encode(hashed);

//       // Build authorization URL
//       const authUrl = new URL("https://accounts.spotify.com/authorize");
//       const params = {
//         response_type: "code",
//         client_id: AUTH_CONFIG.clientId,
//         scope: AUTH_CONFIG.scope,
//         code_challenge_method: "S256",
//         code_challenge: codeChallenge,
//         redirect_uri: AUTH_CONFIG.redirectUri,
//       };

//       // Append params to URL and then redirect
//       authUrl.search = new URLSearchParams(params).toString();
//       console.log("Redirecting to Spotify login...");
//       window.location.href = authUrl.toString();
//     }

//     requestAuthCodeAndRedirect();
//   }, [isAuthenticated, accessToken, refreshToken]);

//   // ! Login auth Step 2: RETRIEVE AUTH CODE FROM URL THEN REQUEST TOKEN
//   useEffect(() => {
//     if (isAuthenticated || !codeVerifier || authCode.current === null) {
//       console.log(
//         "STOPPING STEP 2:",
//         "isAuthenticated:",
//         isAuthenticated === true && "✅",
//         "authCode:",
//         authCode.current,
//       );
//       return;
//     }

//     requestToken(authCode.current, codeVerifier);

//     // Token request function
//     async function requestToken(authCode: string, codeVerifier: string) {
//       if (isAuthenticated) return;
//       try {
//         console.log("requestToken running...");
//         const response = await fetch(AUTH_CONFIG.tokenUrl, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//           body: new URLSearchParams({
//             client_id: AUTH_CONFIG.clientId,
//             grant_type: "authorization_code",
//             code: authCode,
//             redirect_uri: AUTH_CONFIG.redirectUri,
//             code_verifier: codeVerifier,
//           }),
//         });

//         const data = await response.json();
//         console.log("data for aaacccttt:", data);
//         if (response.ok) {
//           localStorage.setItem(
//             "access_token",
//             JSON.stringify({
//               token: data.access_token,
//               expiresAt: Date.now() + data.expires_in * 1000,
//               expiresAtDate: new Date(Date.now() + data.expires_in * 1000),
//               now: new Date(Date.now()),
//             }),
//           );
//           localStorage.setItem("refresh_token", data.refresh_token);
//           const tokenFromLs = localStorage.getItem("access_token");
//           setAccessToken(JSON.parse(tokenFromLs!));
//           setRefreshToken(data.refresh_token);
//           setIsAuthenticated(true);
//           console.log(
//             "✅ both tokens successfully stored - user authenticated",
//           );
//         } else throw new Error("token could not be fetched");
//       } catch (error) {
//         console.error("Error requesting token:", error);
//         // logout();
//       }
//     }
//   }, [isAuthenticated, codeVerifier, accessToken]);

//   // ! run refresh 5 min before token expiry
//   useEffect(() => {
//     async function autoRefreshToken() {
//       try {
//         if (!refreshToken) throw new Error("refresh token could not be found!");

//         const payload = {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//           body: new URLSearchParams({
//             grant_type: "refresh_token",
//             refresh_token: refreshToken,
//             client_id: AUTH_CONFIG.clientId,
//           }),
//         };
//         const response = await fetch(AUTH_CONFIG.tokenUrl, payload);
//         console.log("response:", response);
//         const data = await response.json();

//         if (response.ok) {
//           localStorage.setItem(
//             "access_token",
//             JSON.stringify({
//               token: data.access_token,
//               expiresAt: Date.now() + data.expires_in * 1000,
//               expiresAtDate: new Date(Date.now() + data.expires_in * 1000),
//               now: new Date(Date.now()),
//             }),
//           );
//           localStorage.setItem("refresh_token", data.refresh_token);
//           const tokenFromLs = localStorage.getItem("access_token");
//           setAccessToken(JSON.parse(tokenFromLs!));
//           setRefreshToken(data.refresh_token);
//           setIsAuthenticated(true);
//           console.log(
//             "✅ both tokens successfully stored - user authenticated",
//           );
//         } else throw new Error("refreshing failed - respones was bad..");

//         console.log("✅ token sucessfully refreshed!!!!");
//       } catch (err) {
//         console.error("🛑 ERROR", err);
//       }
//     }

//     // !!!! PROBLEMS:
//     // effect only running on first mount
//     // keeps listening after successfull retreival

//     const safetyNetMinutes = 5;

//     // ! check access token against currentTime every minute
// setInterval(() => {
//   if (!accessToken?.expiresAt) return;
//   const minutesLeft = (accessToken?.expiresAt - Date.now()) / 1000 / 60;
//   console.log("minuteLeft:", minutesLeft);

//   if (minutesLeft < safetyNetMinutes) {
//     // ! run refresh fn
//     autoRefreshToken();
//   }
// }, 60000);
// }, [accessToken?.expiresAt, refreshToken]);

//   // Logout function

//   const logout = () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("refresh_token");
//     localStorage.removeItem("code_verifier");
//     setAccessToken(null);
//     setRefreshToken(null);
//     setIsAuthenticated(false);
//     authCode.current = null;
//   };

//   // Context value
//   const contextValueObject: AuthContextType = {
//     isAuthenticated,
//     accessToken,
//     refreshToken,
//     // login,
//     logout,
//   };

//   return (
//     <AuthContext.Provider value={contextValueObject}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export default AuthProvider;
// // Custom hook to use the auth context
// export const useAuth = () => useContext(AuthContext);
