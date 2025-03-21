import { jwtDecode } from "jwt-decode";

const decodeToken = (token: string) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const tokenExpiresAt = (
  token: string,
  returnFormat?: "seconds" | "milliseconds",
): number | undefined => {
  const decoded = decodeToken(token);
  if (decoded && decoded.exp) {
    const expirationTimeInMs = decoded.exp * 1000;
    console.log("Token expires at:", new Date(expirationTimeInMs));

    return returnFormat === "seconds" ? decoded.exp : expirationTimeInMs;
  }
};
// ! USAGE:
// tokenExpiresAt(tokenString)
