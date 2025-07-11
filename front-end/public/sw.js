// STEP 1: Define what we want to cache 
const CACHE_NAME = 'my-pwa-v1';

//static assets
const ASSETS_TO_CACHE = [
  '/',                              // Home page
  '/manifest.json',                 // PWA manifest
  '/philippines-flag-192.png',      // App icons
  '/philippines-flag-512.png',
  '/RLL_Logo_Full.png',             // Main logo used in app
  '/images/male.svg',               // Gender icons
  '/images/female.svg',
  '/images/undetermined_sex.svg',
  '/favicon.ico'                    // Favicon
];

//cache our files means to download all the fiels in the ASSETS_TO_CACHE and store them in the browser's cache storage then if you're offline, those files can still be loaded! (offline purposes)

// STEP 2: Install Event - Downloads and caches files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)   // Open cache storage
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(ASSETS_TO_CACHE);  // Cache our files
      })
  );
});

// STEP 3: Activate
//clearning up old cache versions + takes control
self.addEventListener('activate', (event) => { //sets up a listener for the activate event
    event.waitUntil( //wait for the completion of activation until this async is done
        caches.keys().then((cacheNames) => //It's like asking "What folders do I have?"
            Promise.all(
                cacheNames 
                .filter((name) => name !== CACHE_NAME) //filtering out the cahceNames so that it doesn't match your current CACHE_NAME
                .map((name) => caches.delete(name))
                //transforming the array into anothe rarry using map
                //turning the array of cache names into an array of promises (each from caches.delete(name))
            )
        )
    );
    self.clients.claim()
})


// STEP 4: fetch
self.addEventListener('fetch', (event) => {
    // GET the request from the event
    const request = event.request;
    
    // RESPOND with:
    event.respondWith(
        // TRY to find request in cache
        caches.match(request)
            .then((cachedResponse) => {
                // IF found in cache:
                if (cachedResponse) {
                    // RETURN cached response
                    return cachedResponse;
                }
                
                // ELSE: TRY to fetch from network
                return fetch(request)
                    .then((networkResponse) => {
                        // IF network succeeds:
                        // CACHE the response (optional for dynamic content)
                        if (request.url.startsWith('http') && request.method === 'GET') {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(request, responseClone);
                                });
                        }
                        // RETURN network response
                        return networkResponse;
                    })
                    .catch(() => {
                        // ELSE: RETURN error/offline message
                        if (request.destination === 'document') {
                            return caches.match('/');
                        }
                        return new Response('Offline', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});