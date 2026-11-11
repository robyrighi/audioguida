// Service worker: rende la app disponibile offline.
// IMPORTANTE: ogni volta che modifichi index.html (o altri file), aumenta la versione qui sotto
// e ricarica tutto su GitHub Pages. Gli audio NON sono qui: stanno nella memoria locale dell'iPad.
const CACHE = 'audioguida-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
// Loghi: messi in cache se presenti (se mancano la app funziona lo stesso)
const OPTIONAL = ['./img/logo-fonoteca.png', './img/logo-confederazione.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(ASSETS).then(() => Promise.all(OPTIONAL.map(u => c.add(u).catch(() => {})))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    if (req.mode === 'navigate') {
      const page = await caches.match('./index.html');
      if (page) return page;
    }
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;
    try {
      return await fetch(req);
    } catch (err) {
      const fallback = await caches.match('./index.html');
      return fallback || Response.error();
    }
  })());
});
