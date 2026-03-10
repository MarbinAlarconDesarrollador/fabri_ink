/* ============================================================
   INK MASTER — Service Worker (sw.js)
   Estrategia: Cache First para assets estáticos,
               Network First para imágenes remotas
   ============================================================ */

const CACHE_NAME    = 'ink-master-v2';
const STATIC_ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Barlow+Condensed:ital,wght@0,300;0,400;0,700;0,900;1,400&family=Space+Mono:ital@0;1&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
];

// Install: pre-cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

// Fetch: Cache First for static, stale-while-revalidate for images
self.addEventListener('fetch', event => {
    const { request } = event;

    // Only handle GET requests
    if (request.method !== 'GET') return;

    // Skip non-http(s)
    if (!request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(request).then(cached => {
            const fetchPromise = fetch(request).then(response => {
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                }
                return response;
            }).catch(() => cached); // Return cached if network fails

            // Return cached immediately, update in background
            return cached || fetchPromise;
        })
    );
});
