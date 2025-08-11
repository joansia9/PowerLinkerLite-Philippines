const CACHE_NAME = 'powerlinker-v1';

// Function to get the actual asset filenames from the asset manifest
async function getAssetManifest() {
  try {
    const response = await fetch(self.location.origin + '/asset-manifest.json');//FIXME: error here (ROOT PROBLEM)
    //TODO: error bc sw fetch relative to their own scope, not from the origin root.
// 💥 BOOM: If the response is empty (like offline), this line throws
    if(!response.ok || response.status === 0) {
      throw new Error("No response or failed to fetch json")
    }
    const manifest = await response.json();
    return manifest.files;
  } catch (error) {
    console.error('[SW] Failed to load asset manifest:', error);
    return {};
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
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', event.request.url);
          return cachedResponse;
        }

        return fetch(event.request);
      })
      .catch(error => {
        console.error('[SW] Fetch failed:', event.request.url, error); //FIXME: ERROR HERE

        // 👇 Document fallback
        if (event.request.destination === 'document') {
          return new Response(`
            <!DOCTYPE html>
            <html lang="en"><head><meta charset="UTF-8"><title>Offline</title></head>
            <body><h1>You're offline 😭</h1><p>Please reconnect.</p></body></html>
          `, { headers: { 'Content-Type': 'text/html' } });
        }

        // 👇 Image fallback
        if (event.request.destination === 'image') {
          return caches.match('/images/undetermined_sex.svg');
        }

        return new Response('', { status: 200 });
      })
  );
});
