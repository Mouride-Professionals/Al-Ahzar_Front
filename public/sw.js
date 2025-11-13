const CACHE_NAME = 'al-azhar-cache-v3';
const APP_SHELL = ['/', '/manifest.json', '/logo-192.png', '/logo.png'];

// **NEW: Add cache size limits**
const MAX_CACHE_SIZE = 50; // Maximum number of cached items
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

/**
 * Limit cache size by removing oldest entries
 */
const limitCacheSize = async (cacheName, maxSize) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxSize) {
    // Remove oldest entries (first in cache)
    const itemsToDelete = keys.length - maxSize;
    for (let i = 0; i < itemsToDelete; i++) {
      await cache.delete(keys[i]);
    }
    console.log(`[SW] Cleaned ${itemsToDelete} old cache entries`);
  }
};

/**
 * Clean expired cache entries
 */
const cleanExpiredCache = async (cacheName, maxAge) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const now = Date.now();

  for (const request of keys) {
    const response = await cache.match(request);
    if (response) {
      const dateHeader = response.headers.get('date');
      if (dateHeader) {
        const cachedTime = new Date(dateHeader).getTime();
        if (now - cachedTime > maxAge) {
          await cache.delete(request);
          console.log(`[SW] Removed expired cache entry: ${request.url}`);
        }
      }
    }
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
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
      .then(() => cleanExpiredCache(CACHE_NAME, MAX_CACHE_AGE))
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

  // Don't cache API calls, _next data, or dynamic routes
  const url = new URL(request.url);
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('/_next/data/') ||
    url.search.includes('_rsc=')
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // **NEW: Only cache specific file types to prevent quota issues**
  const cacheableExtensions = [
    '.js',
    '.css',
    '.woff',
    '.woff2',
    '.png',
    '.jpg',
    '.svg',
    '.ico',
  ];
  const shouldCache = cacheableExtensions.some((ext) =>
    url.pathname.endsWith(ext)
  );

  if (!shouldCache && !APP_SHELL.includes(url.pathname)) {
    // Don't cache HTML pages or other dynamic content
    event.respondWith(fetch(request));
    return;
  }

  // Cache static assets - Network first strategy
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(async (cache) => {
            await cache.put(request, responseClone);
            // Limit cache size after adding new item
            await limitCacheSize(CACHE_NAME, MAX_CACHE_SIZE);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return offline page
          return new Response(
            `<!DOCTYPE html>
            <html lang="fr">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>Hors ligne - Al-Azhar</title>
              <style>
                body {
                  font-family: system-ui, -apple-system, sans-serif;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  margin: 0;
                  background: #f7fafc;
                  text-align: center;
                  padding: 20px;
                }
                .container {
                  max-width: 400px;
                }
                h1 {
                  color: #2d3748;
                  margin-bottom: 1rem;
                }
                p {
                  color: #718096;
                  margin-bottom: 1.5rem;
                }
                button {
                  background: #d97706;
                  color: white;
                  border: none;
                  padding: 12px 24px;
                  border-radius: 8px;
                  cursor: pointer;
                  font-size: 16px;
                }
                button:hover {
                  background: #b45309;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>📡 Hors ligne</h1>
                <p>Veuillez vérifier votre connexion internet et réessayer.</p>
                <button onclick="location.reload()">Réessayer</button>
              </div>
            </body>
            </html>`,
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

// **NEW: Periodic cache cleanup**
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    event.waitUntil(
      Promise.all([
        cleanExpiredCache(CACHE_NAME, MAX_CACHE_AGE),
        limitCacheSize(CACHE_NAME, MAX_CACHE_SIZE),
      ])
    );
  }
});
