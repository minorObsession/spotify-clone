import { base64encode, generateCodeVerifier, sha256 } from "./auth/authHelpers";
console.log("script running...");
const clientId = "91915dd042e1406aa1ca2fef874d5e1b";
const redirectUri = "http://127.0.0.1:5173/home";
const scope = "user-read-private user-read-email";

let authCode: null | string = null;
console.log("authCode:", authCode);
let storedCodeVerifier: null | string = null;
storedCodeVerifier = window.localStorage.getItem("code_verifier");
console.log("storedCodeVerifier:", storedCodeVerifier);

const authFlow = async () => {
  // if (storedCodeVerifier)
  // Generate code verifier and code challenge from the verifier
  const codeVerifier = generateCodeVerifier();
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
  window.location.href = authUrl.toString();

  // after redirect - set auth code based on url

  const urlParams = new URLSearchParams(window.location.search);
  authCode = urlParams.get("code");

  console.log("flow finished");
};
// if NO auth code and NO code verifier - start whole auth flow
if (!authCode && !storedCodeVerifier) {
  await authFlow();
}

// If YES auth code but NO code verifier, generate verifier and then request token
if (authCode && !storedCodeVerifier) {
  generateCodeVerifier();
}
// If NO auth code but YES code verifier, DELETE code verifier to reset the flow
if (!authCode && storedCodeVerifier) {
  localStorage.removeItem("code_verifier");
  // console.log("code ver removed ... ");
  await authFlow();
}

// if YES auth code and YES code verifier - request token
if (authCode && storedCodeVerifier) {
  console.log("requesting token...");
  await requestToken(authCode, storedCodeVerifier);
}

async function requestToken(authCode: string, codeVerifier: string) {
  try {
    console.log("Requesting token with authCode:", authCode);
    console.log("Requesting token with codeVerifier:", codeVerifier);
    const url = "https://accounts.spotify.com/api/token";

    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code: authCode,
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
      console.error("Authentication failed:", data);
    }
  } catch (err) {
    console.error("Error requesting token:", err);
  }
}
