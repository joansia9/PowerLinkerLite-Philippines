const CACHE_NAME = 'powerlinker-v1';
const urlsToCache = [
  '/',
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
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});