import { ActionFunctionArgs } from "react-router";
import { getFromLocalStorage } from "../features/auth/authHelpers";
import { AccessTokenType } from "../features/auth/Auth";

export function createLoader<T>(
  nameOfData: string,
  loadingFunction: (id: string) => Promise<T | null>,
) {
  return async ({ params }: ActionFunctionArgs): Promise<T> => {
    if (!params.id || typeof params.id !== "string") {
      console.error(`🚨 ❌ Invalid ${nameOfData} ID:`, params.id);
      throw new Response(`Invalid ${nameOfData} ID`, { status: 400 });
    }

    try {
      const data = await loadingFunction(params.id);
      if (!data) {
        throw new Response(`${nameOfData} not found`, { status: 404 });
      }

      // ! hovering data: const data: NonNullable<Awaited<T>>
      // ! NEED TO UNDERSTAND WHAT THIS MEANS
      return data;
    } catch (error) {
      console.error(`🚨 ❌ Failed to load ${nameOfData}:`, error);
      throw new Response(`Failed to fetch ${nameOfData}`, { status: 500 });
    }
  };
}

export const fetchFromSpotify = async <ResponseType, ReturnType>({
  endpoint,
  transformFn,
  cacheName,
  offset = "",
  onCacheFound,
  onDataReceived,
}: {
  endpoint: string;
  offset?: string;
  cacheName: string;
  transformFn: (data: ResponseType) => Promise<ReturnType> | ReturnType;
  onCacheFound?: (data: ReturnType) => void;
  onDataReceived?: (data: ReturnType) => void;
}): Promise<ReturnType | null> => {
  try {
    const accessToken = getFromLocalStorage<AccessTokenType>("access_token");
    if (!accessToken) {
      throw new Error("Access token expired or doesn't exist");
    }

    // Check local storage for cached data if cacheName is provided a is true
    if (cacheName) {
      const cachedData = getFromLocalStorage<ReturnType>(cacheName);
      console.log("cachedData found", cachedData);

      if (cachedData) {
        if (onCacheFound) onCacheFound(cachedData);
        // console.log("✅ Using cached data, skipping fetch.");
        return cachedData;
      }
    }

    // Fetch data from Spotify API
    console.log(`🛜 Fetching from API: ${endpoint}`);
    const res = await fetch(`https://api.spotify.com/v1/${endpoint}${offset}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${res.statusText}`);
    }

    const data: ResponseType = await res.json();

    const transformedData: ReturnType = await transformFn(data);

    if (onDataReceived) onDataReceived(transformedData);

    // Store in localStorage if cacheName is provided
    if (cacheName) {
      localStorage.setItem(cacheName, JSON.stringify(transformedData));
    }

    return transformedData;
  } catch (err) {
    console.error("🛑 ❌", err);
    return null;
  }
};
