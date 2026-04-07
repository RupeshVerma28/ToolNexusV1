const CACHE_NAME = "prodexify-cache-v1";
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/favicon.ico",
  "/manifest.json",
  // add other core assets (css/js) if known, e.g. '/static/js/main.js'
];

// Install - precache core assets
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

// Activate - cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

// Fetch - network first for navigation, cache-first for others with fallback
// Fetch - network first for navigation, stale-while-revalidate for others
self.addEventListener("fetch", (event) => {
  const { request } = event;
  
  // Exclude API calls or non-GET requests from caching
  if (request.method !== "GET" || request.url.includes("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          // Clone response and cache it
          const respClone = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, respClone));
          return resp;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Stale-while-revalidate for assets
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Silently ignore fetch errors in SWR
      });

      // Return cached immediately if available, otherwise wait for network
      return cached || fetchPromise;
    })
  );
});
