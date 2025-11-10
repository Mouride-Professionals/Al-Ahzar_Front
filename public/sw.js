const CACHE_NAME = 'al-azhar-cache-v2';
const APP_SHELL = ['/', '/manifest.json', '/logo-192.png', '/logo.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
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
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Don't cache non-GET requests
  if (
    request.method !== 'GET' ||
    !request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  // **NEW: Don't cache API calls, _next data, or dynamic routes**
  const url = new URL(request.url);
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('/_next/data/') ||
    url.search.includes('_rsc=') // Next.js 13+ RSC requests
  ) {
    // Let API calls go straight to network, no caching
    event.respondWith(fetch(request));
    return;
  }

  // Cache static assets only - Network first for navigations
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => {
        // Only use cache as fallback for same-origin requests
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return a proper offline response instead of failing
          return new Response(
            '<html><body><h1>Offline</h1><p>Veuillez vérifier votre connexion internet.</p></body></html>',
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/html; charset=utf-8',
              }),
            }
          );
        });
      })
  );
});
