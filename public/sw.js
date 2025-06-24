// Simple Service Worker for Spotify Clone
const CACHE_NAME = "spotify-cache-v1";

// Install - cache static files
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  self.skipWaiting();
});

// Activate - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Handle messages from the main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "INVALIDATE_CACHE") {
    const { endpoint } = event.data;
    invalidateCacheForEndpoint(endpoint);
  }
});

// Invalidate cache for specific endpoint
async function invalidateCacheForEndpoint(endpoint) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();

    // Find and delete cache entries that match the endpoint
    const matchingKeys = keys.filter((key) => {
      const url = new URL(key.url);
      return url.pathname.includes(endpoint);
    });

    // Also invalidate related Zustand state cache entries
    const zustandKeys = keys.filter((key) => {
      return (
        key.url.includes("zustand-") &&
        (key.url.includes("playlists") ||
          key.url.includes("playlist") ||
          key.url.includes("user"))
      );
    });

    const allKeysToDelete = [...matchingKeys, ...zustandKeys];
    await Promise.all(allKeysToDelete.map((key) => cache.delete(key)));

    console.log(`Invalidated cache for endpoint: ${endpoint}`);
    console.log(`Also invalidated ${zustandKeys.length} Zustand state entries`);
  } catch (error) {
    console.error("Error invalidating cache:", error);
  }
}

// Fetch - intercept requests
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only cache Spotify API requests
  if (url.origin === "https://api.spotify.com") {
    event.respondWith(handleSpotifyRequest(request));
  }
});

// Handle Spotify API requests
async function handleSpotifyRequest(request) {
  // Only cache GET requests
  if (request.method !== "GET") {
    console.log("Non-GET request, not caching:", request.url);
    return fetch(request);
  }

  const cacheKey = request.url;

  // Check if request has cache-busting headers
  const hasCacheBustingHeaders =
    request.headers.get("Cache-Control") === "no-cache" ||
    request.headers.get("Pragma") === "no-cache";

  // If cache-busting headers are present, skip cache entirely
  if (hasCacheBustingHeaders) {
    console.log(
      "Cache-busting headers detected, fetching fresh data:",
      request.url,
    );
    try {
      const networkResponse = await fetch(request);
      return networkResponse;
    } catch (error) {
      console.error("Network error with cache-busting:", error);
      return new Response(
        JSON.stringify({
          error: "Network error - Please check your connection",
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }

  try {
    // Try to get from cache first
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(cacheKey);

    if (cachedResponse) {
      // Check if cache is still fresh (5 minutes)
      const cacheTime = new Date(cachedResponse.headers.get("sw-cache-time"));
      const now = new Date();
      // ! TODO: CHANGE TO 5 MINUTES
      // const fiveMinutes = 5 * 60 * 1000;
      const oneDay = 1 * 24 * 60 * 60 * 1000;
      // if cache is still fresh, serve from cache
      if (now - cacheTime < oneDay) {
        console.log("Serving from cache:", request.url);
        // Add header to indicate this came from cache
        const headers = new Headers(cachedResponse.headers);
        headers.set("sw-cache-source", "cache");
        return new Response(cachedResponse.body, {
          status: cachedResponse.status,
          statusText: cachedResponse.statusText,
          headers: headers,
        });
      } else {
        // Cache expired, remove it
        await cache.delete(cacheKey);
      }
    }

    // Fetch from network
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache the response with metadata
      const responseToCache = networkResponse.clone();
      const headers = new Headers(responseToCache.headers);
      headers.set("sw-cache-time", new Date().toISOString());
      headers.set("sw-cache-source", "fresh");

      await cache.put(
        cacheKey,
        new Response(responseToCache.body, {
          status: responseToCache.status,
          statusText: responseToCache.statusText,
          headers: headers,
        }),
      );
      console.log("Cached response:", request.url);
    }

    // Return response with cache source header
    const headers = new Headers(networkResponse.headers);
    headers.set("sw-cache-source", "fresh");
    return new Response(networkResponse.body, {
      status: networkResponse.status,
      statusText: networkResponse.statusText,
      headers: headers,
    });
  } catch (error) {
    console.error("Network error:", error);

    // Try to serve from cache even if expired
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(cacheKey);

    if (cachedResponse) {
      console.log("Serving expired cache as fallback:", request.url);
      return cachedResponse;
    }

    // Return offline response
    return new Response(
      JSON.stringify({
        error: "Offline - Please check your connection",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
