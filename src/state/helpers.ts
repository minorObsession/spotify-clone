import { ActionFunctionArgs } from "react-router";
import { getFromLocalStorage } from "../features/auth/authHelpers";
import { AccessTokenType } from "../features/auth/Auth";
import { useStateStore } from "./store";
// import { store } from "./store";

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
  cacheName?: string;
  method?: string;
  requestBody?: string;
  bypassCache?: boolean;
  additionalHeaders?: Record<string, string>;
  transformFn?: (data: ResponseType) => Promise<ReturnType> | ReturnType;
  onCacheFound?: (data: ReturnType) => void;
  onDataReceived?: (data: ReturnType) => void;
}
export const fetchFromSpotify = async <ResponseType, ReturnType>({
  endpoint,
  transformFn,
  cacheName,
  offset = "",
  onCacheFound,
  onDataReceived,
  method = "GET",
  requestBody,
  bypassCache = false,
}: FetchFromSpotifyParams<ResponseType, ReturnType>): Promise<ReturnType> => {
  try {
    console.log(`calling fetch ${endpoint} ${cacheName} `);

    // ! THIS CODE WAS CAUSING AN ISSUE
    // debugger;
    await useStateStore.getState().waitForAuthentication();

    const accessToken = getFromLocalStorage<AccessTokenType>("access_token");
    if (!accessToken) {
      throw new Error("Access token expired or doesn't exist");
    }

    // Check local storage for cached data if cacheName is provided a is true

    if (cacheName && !bypassCache) {
      const cachedData = getFromLocalStorage<ReturnType>(cacheName);
      if (cachedData) {
        if (onCacheFound) onCacheFound(cachedData);
        console.log("returning Cached data");
        return cachedData;
      }
    }

    // Fetch data from Spotify API
    console.log(
      `🛜 🛜 🛜 Calling spotify API: ${endpoint} ${method} ${cacheName} ${offset}`,
    );

    const res = await fetch(`https://api.spotify.com/v1/${endpoint}${offset}`, {
      method: method,
      headers: {
        Authorization: `Bearer ${accessToken.token}`,
        "Content-Type": "application/json",
      },
      body: requestBody,
    });
    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${res.statusText}`);
    }

    // if it's not a get request
    if (!transformFn) throw new Error("❌ Transform function not found..");

    const data: ResponseType = await res.json();

    const transformedData: ReturnType = await transformFn(data);

    if (onDataReceived) onDataReceived(transformedData);

    // const dataToStore = transformedData.
    // Store in localStorage if cacheName is provided
    if (cacheName) {
      localStorage.setItem(cacheName, JSON.stringify(transformedData));
    }

    return transformedData;
  } catch (err) {
    console.error("🛑 ❌", err);
    throw err;
  }
};
