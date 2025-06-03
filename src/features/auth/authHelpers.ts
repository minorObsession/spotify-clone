import { jwtDecode } from "jwt-decode";
export const generateRandomString = (length: number) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

export const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};

export const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

// * put into REUSABLE folder
export const getFromLocalStorage = <T>(key: string): T | null => {
  const item = localStorage.getItem(key);
  if (item !== null) return JSON.parse(item);
  else return null;
};

export function saveToLocalStorage<T>(key: string, newData: T | T[]): void {
  try {
    const existingData = getFromLocalStorage<T[]>(key) ?? [];
    const normalizedNewData = Array.isArray(newData) ? newData : [newData];
    const updatedData = [...normalizedNewData, ...existingData];
    localStorage.setItem(key, JSON.stringify(updatedData));
  } catch (error) {
    console.error(
      `Failed to save data to localStorage under key "${key}":`,
      error,
    );
  }
}

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
