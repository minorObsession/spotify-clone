import { base64encode, generateRandomString, sha256 } from "./auth/authHelpers";
console.log("script running...");
const clientId = "91915dd042e1406aa1ca2fef874d5e1b";
const redirectUri = "http://127.0.0.1:5173/home";
const scope = "user-read-private user-read-email";

// Check if we're in the callback with an auth code
const urlParams = new URLSearchParams(window.location.search);
let authCode: string | null = urlParams.get("code");
console.log("authCode:", authCode);
const storedCodeVerifier = window.localStorage.getItem("code_verifier");
console.log("storedCodeVerifier:", storedCodeVerifier);

// if YES auth code and YES code verifier - request token
if (authCode && storedCodeVerifier) {
  await requestToken(authCode, storedCodeVerifier);
}

// If YES auth code but NO code verifier, then start over
if (authCode && !storedCodeVerifier) {
  localStorage.clear();
  authCode = null;
  // ! re-start flow
}
// If NO auth code but YES code verifier, then start over
if (!authCode && storedCodeVerifier) {
  localStorage.clear();
  authCode = null;
  // ! re-start flow
}

// if NO auth code and NO code verifier - start whole auth flow
if (!authCode && !storedCodeVerifier) {
  // Generate code challenge from the verifier
  const codeVerifier = generateRandomString(64);
  window.localStorage.setItem("code_verifier", codeVerifier);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  // Build authorization URL
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  const params = {
    response_type: "code",
    client_id: clientId,
    scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };

  // Append params to URL and then redirect
  authUrl.search = new URLSearchParams(params).toString();
  console.log("Redirecting to Spotify login...");
  window.location.href = authUrl.toString();
}

async function requestToken(authCode: string | null, codeVerifier: string) {
  try {
    console.log("Requesting token with code_verifier:", codeVerifier);
    const url = "https://accounts.spotify.com/api/token";

    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code: authCode!,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    };

    const response = await fetch(url, payload);
    const data = await response.json();

    if (response.ok) {
      console.log("Token response:", data);
      localStorage.setItem("access_token", data.access_token);
      console.log("Authentication successful!");
    } else {
      localStorage.clear();
      authCode = null;
      console.error("Authentication failed:", data);
    }
  } catch (err) {
    console.error("Error requesting token:", err);
    localStorage.clear();
    authCode = null;
  }
}
