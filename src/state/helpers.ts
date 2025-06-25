import { ActionFunctionArgs } from "react-router";
import { useStateStore } from "./store";
import Cookies from "js-cookie";
import { AccessTokenType } from "../features/auth/Auth";

// ! make at least 1 argument required!!!
export function createLoader<T>(
  nameOfData: string,
  loadingFunction: (id?: string, query?: string) => Promise<T | null>,
) {
  return async ({ params }: ActionFunctionArgs): Promise<T> => {
    const param = params.id || params.query;

    if (!param || typeof param !== "string") {
      console.error(`🚨 ❌ Invalid ${nameOfData} param:`, param);
      throw new Response(`Invalid ${nameOfData} param`, { status: 400 });
    }

    try {
      const data = await loadingFunction(param);
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

interface FetchFromSpotifyParams<ResponseType, ReturnType> {
  endpoint: string;
  offset?: string;
  method?: string;
  requestBody?: string;
  additionalHeaders?: Record<string, string>;
  transformFn?: (data: ResponseType) => Promise<ReturnType> | ReturnType;
  onDataReceived?: (data: ReturnType) => void;
  bypassCache?: boolean;
}

export const fetchFromSpotify = async <ResponseType, ReturnType>({
  endpoint,
  transformFn,
  offset = "",
  onDataReceived,
  method = "GET",
  requestBody,
  bypassCache = false,
}: FetchFromSpotifyParams<ResponseType, ReturnType>): Promise<ReturnType> => {
  try {
    console.log(`calling fetch ${endpoint} `);

    await useStateStore.getState().waitForAuthentication();

    const accessToken: AccessTokenType = JSON.parse(
      Cookies.get("accessToken") || "{}",
    );

    if (!accessToken.token) {
      throw new Error("Access token expired or doesn't exist");
    }

    // Prepare headers
    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken.token}`,
      "Content-Type": "application/json",
    };

    // Add cache-busting header if bypassCache is true
    // This will force the service worker to fetch fresh data
    if (bypassCache) {
      headers["Cache-Control"] = "no-cache";
      headers["Pragma"] = "no-cache";
    }

    // Fetch data from Spotify API - Service Worker will handle caching automatically
    const res = await fetch(`https://api.spotify.com/v1/${endpoint}${offset}`, {
      method: method,
      headers,
      body: requestBody,
    });

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${res.statusText}`);
    }

    // Check if response came from cache or fresh API
    const cacheSource = res.headers.get("sw-cache-source");
    const isFreshCall = cacheSource === "fresh" || cacheSource === null;

    // Only log when it's a fresh API call
    if (isFreshCall) {
      console.log(
        `🛜 🛜 🛜 Calling spotify API: ${endpoint} ${method} ${offset} ${bypassCache ? "(bypassing cache)" : ""}`,
      );
    } else {
      console.log(`📦 Serving from cache: ${endpoint}`);
    }

    // ! this is a dirty hack to get the createNewPlaylist to work
    if (
      method === "PUT" ||
      (method === "POST" && !transformFn) ||
      (method === "DELETE" && !transformFn)
    )
      return undefined as unknown as ReturnType;

    // basically bellow code runs if it's NOT a GET request
    if (!transformFn) throw new Error("❌ Transform function not found..");

    const data: ResponseType = await res.json();

    const transformedData: ReturnType = await transformFn(data);

    // Call appropriate callback - service worker handles cache vs fresh data
    if (onDataReceived) onDataReceived(transformedData);

    return transformedData;
  } catch (err) {
    console.error("🛑 ❌", err);
    throw err;
  }
};

// Robust cache invalidation function for use across all slices
export const invalidateCacheForEndpoint = async (
  endpoint: string,
): Promise<void> => {
  try {
    const { serviceWorker } = await import("../serviceWorker");
    await serviceWorker.invalidateCacheForEndpoint(endpoint);
  } catch (error) {
    console.error(`Failed to invalidate cache for ${endpoint}:`, error);
  }
};
