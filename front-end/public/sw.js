self.addEventListener('install', event => {
    console.log('[SW] Installed');
    self.skipWaiting(); //prevents autorefresh
  });
  
  self.addEventListener('activate', event => {
    console.log('[SW] Activated');
    self.clients.claim();
  });
  
  self.addEventListener('fetch', event => {
    // Pass through all requests to the network (no caching yet)
    return;
  });