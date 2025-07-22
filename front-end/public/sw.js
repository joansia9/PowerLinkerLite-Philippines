const CACHE_NAME = 'powerlinker-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/RLL_Logo_Full.png',
  '/RLL_Logo.png',
  '/philippines-flag-192.png',
  '/philippines-flag-512.png',
  '/images/male.svg',
  '/images/female.svg',
  '/images/undetermined_sex.svg',
  '/images/checkmark.svg'
];

self.addEventListener('install', event => {
  console.log('[SW] Installed');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  // Don't call skipWaiting() to prevent auto-refresh
});

self.addEventListener('activate', event => {
  console.log('[SW] Activated');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Don't call clients.claim() to prevent auto-refresh
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(err => {
        console.error('[SW] Fetch failed; returning fallback.', err);

        // Fallback logic for different types of requests
        if (event.request.destination === 'document') {
          // Return a basic offline HTML response if you don’t have offline.html
          return new Response('<h1>Offline</h1><p>Please reconnect to the internet.</p>', {
            headers: { 'Content-Type': 'text/html' }
          });
        }

        // Optional fallback for images
        if (event.request.destination === 'image') {
          return caches.match('/images/undetermined_sex.svg');
        }

        // Default fallback (blank response)
        return new Response('', { status: 200 });
      })
  );
});
