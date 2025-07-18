
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