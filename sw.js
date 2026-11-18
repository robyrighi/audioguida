// Service worker: rende la app disponibile offline.
// Strategia:
//  - pagina (index.html) e manifest: PRIMA la rete (versione aggiornata se c'è connessione),
//    se la rete manca o è lenta (> 4 s) si usa la copia salvata;
//  - icone e loghi: prima la copia salvata.
// Gli audio NON sono qui: stanno nella memoria locale dell'iPad (IndexedDB).
// Ad ogni modifica si aumenta comunque la versione qui sotto.
const CACHE = 'audioguida-v11';
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
const NETWORK_TIMEOUT_MS = 4000;

// Scarica sempre dal server, ignorando la cache HTTP del browser
const fresh = url => fetch(new Request(url, { cache: 'reload' }));

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(ASSETS.map(async u => {
      const r = await fresh(u);
      if (!r.ok) throw new Error('Download fallito: ' + u);
      await c.put(u, r);
    }));
    await Promise.all(OPTIONAL.map(async u => {
      try { const r = await fresh(u); if (r.ok) await c.put(u, r); } catch (_) {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(v => { clearTimeout(t); resolve(v); }, e => { clearTimeout(t); reject(e); });
  });
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isPage = req.mode === 'navigate' || /\/(index\.html)?$/.test(url.pathname) || url.pathname.endsWith('/manifest.json');

  if (isPage) {
    // Rete prima: aggiorna la copia salvata; senza rete usa la copia salvata
    event.respondWith((async () => {
      const key = url.pathname.endsWith('/manifest.json') ? './manifest.json' : './index.html';
      try {
        const r = await withTimeout(fetch(new Request(req.url, { cache: 'no-store' })), NETWORK_TIMEOUT_MS);
        if (r && r.ok) {
          const c = await caches.open(CACHE);
          await c.put(key, r.clone());
          return r;
        }
        throw new Error('HTTP ' + (r && r.status));
      } catch (_) {
        const cached = await caches.match(key);
        return cached || Response.error();
      }
    })());
    return;
  }

  // Icone e loghi: copia salvata prima
  event.respondWith((async () => {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;
    try {
      return await fetch(req);
    } catch (_) {
      return Response.error();
    }
  })());
});
