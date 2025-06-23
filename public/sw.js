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
  const cacheKey = `${request.method}:${request.url}`;

  try {
    // Try to get from cache first
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(cacheKey);

    if (cachedResponse) {
      // Check if cache is still fresh (5 minutes)
      const cacheTime = new Date(cachedResponse.headers.get("sw-cache-time"));
      const now = new Date();
      const fiveMinutes = 5 * 60 * 1000;

      // if cache is still fresh, serve from cache
      if (now - cacheTime < fiveMinutes) {
        console.log("Serving from cache:", request.url);
        return cachedResponse;
      } else {
        // Cache expired, remove it
        await cache.delete(cacheKey);
      }
    }

    // Fetch from network
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache the response
      const responseToCache = networkResponse.clone();
      const headers = new Headers(responseToCache.headers);
      headers.set("sw-cache-time", new Date().toISOString());

      const cachedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers,
      });

      const cache = await caches.open(CACHE_NAME);
      await cache.put(cacheKey, cachedResponse);
      console.log("Cached response:", request.url);
    }

    return networkResponse;
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
