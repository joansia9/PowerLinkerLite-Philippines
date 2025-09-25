const CACHE_NAME = 'powerlinker-v1';

if (!('serviceWorker' in navigator)) {
  console.log('Service workers not supported');
}

// Function to get the actual asset filenames from the asset manifest
async function getAssetManifest() {
  try {
    // Fix: Use absolute path from registration scope
    const response = await fetch('/asset-manifest.json');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const manifest = await response.json();
    return manifest.files || {};
  } catch (error) {
    console.warn('[SW] Asset manifest not available, using fallback caching:', error.message);
    // Return fallback assets for development/production
    return {
      'main.js': '/static/js/bundle.js',
      'main.css': '/static/css/main.css'
    };
  }
}

// Base URLs to cache (static assets)
const staticUrlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // '/static/js/bundle.js',
  // '/static/css/main.css',
  '/RLL_Logo_Full.png',
  '/RLL_Logo.png',
  '/philippines-flag-192.png',
  '/philippines-flag-512.png',
  '/images/male.svg',
  '/images/female.svg',
  '/images/undetermined_sex.svg',
  '/images/checkmark.svg',
  '/newCSSIcons/philippinesBook.png',
];
self.addEventListener('install', event => {
  console.log('[SW] Installed');

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      try {
        console.log('[SW] Caching static assets:', staticUrlsToCache);
        await cache.addAll(staticUrlsToCache);
        console.log('[SW] Static assets cached');
      } catch (err) {
        console.warn('[SW] Failed to cache static assets:', err);
      }

      let dynamicAssets = [];
      try {
        const assets = await getAssetManifest();

        //TODO: guard dynamic asset caching if manifest fails

        //if manifest fails
        if (!assets || Object.keys(assets).length === 0) {
          console.warn('[SW] Asset manifest is empty or not loaded. Skipping dynamic caching.');
          return;
        }

        Object.values(assets).forEach(asset => {
          if (typeof asset === 'string' &&
              (asset.endsWith('.js') || asset.endsWith('.css')) &&
              !asset.includes('.map')) {
            dynamicAssets.push(asset);
          }
        });

        console.log('[SW] Dynamic assets to cache:', dynamicAssets);

        await cache.addAll(dynamicAssets);
      } catch (err) {
        console.warn('[SW] Failed to load asset manifest or cache dynamic assets:', err);
      }
    })()
  );

  self.skipWaiting();
});

// self.addEventListener('install', event => {
//   console.log('[SW] Installed');
//   event.waitUntil(
//     (async () => {
//       const cache = await caches.open(CACHE_NAME);
//       console.log('[SW] Caching static assets:', staticUrlsToCache);
      
//       try {
//         console.log('[SW] Caching static assets:', staticUrlsToCache);
//         await cache.addAll(staticUrlsToCache);
//         console.log('[SW] Static assets cached');
//       } catch (err) {
//         console.warn('[SW] Failed to cache static assets:', err);
//       }

//       // await cache.addAll(staticUrlsToCache)
//       // .then(() => console.log('[SW] Static assets cached'))
//       // .catch(err => console.error('[SW] Failed to cache static assets:', err));

      
//       const assets = await getAssetManifest();
//       const dynamicAssets = [];
      
//       // Add main JS and CSS files and these are the KEYS (main.js and main.css)
//       if (assets['main.js']) dynamicAssets.push(assets['main.js']);
//       if (assets['main.css']) dynamicAssets.push(assets['main.css']);
      
//       Object.values(assets).forEach(asset => {
//         if (typeof asset === 'string' && 
//             (asset.endsWith('.js') || asset.endsWith('.css')) && 
//             !asset.includes('.map')) {
//           dynamicAssets.push(asset);
//         }
//       });
//       console.log('[SW] Dynamic assets to cache:', dynamicAssets);
//       if (dynamicAssets.length > 0) {
//         await cache.addAll(dynamicAssets) //FIXME: error here
//         .then(() => console.log('[SW] Dynamic assets cached'))
//         .catch(err => console.error('[SW] Failed to cache dynamic assets:', err));

//       }
//     })()
//   );
//   self.skipWaiting();
// });

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
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Skip non-GET requests and external requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', event.request.url);
          return cachedResponse;
        }

        // Try network first, fall back to cache
        return fetch(event.request)
          .then(networkResponse => {
            // Cache successful responses for future use
            if (networkResponse.ok && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseClone));
            }
            return networkResponse;
          })
          .catch(error => {
            console.warn('[SW] Network failed, trying offline fallbacks:', event.request.url);

            if (event.request.destination === 'document') {
              return new Response(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <title>Power Linker - Offline</title>
                  <style>
                    body { font-family: system-ui; text-align: center; padding: 2rem; background: #f5f5f5; }
                    .offline-container { max-width: 400px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; }
                    .logo { width: 64px; height: 64px; margin: 0 auto 1rem; background: #5B7A34; border-radius: 50%; }
                    button { background: #5B7A34; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 4px; cursor: pointer; }
                  </style>
                </head>
                <body>
                  <div class="offline-container">
                    <div class="logo"></div>
                    <h1>You're offline</h1>
                    <p>Power Linker needs an internet connection to fetch new genealogy hints.</p>
                    <button onclick="window.location.reload()">Try Again</button>
                  </div>
                </body>
                </html>
              `, { 
                headers: { 
                  'Content-Type': 'text/html',
                  'Cache-Control': 'no-cache'
                } 
              });
            }

            if (event.request.destination === 'image') {
              return caches.match('/images/undetermined_sex.svg') || 
                     new Response('', { status: 404 });
            }

            if (event.request.url.includes('/api/')) {
              return new Response(JSON.stringify({ 
                error: 'Offline', 
                message: 'This feature requires an internet connection' 
              }), { 
                headers: { 'Content-Type': 'application/json' },
                status: 503 
              });
            }

            return new Response('', { status: 404 });
          });
      })
  );
});
