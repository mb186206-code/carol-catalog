// Service Worker — catálogo offline.
// Caminhos relativos para funcionar tanto na raiz quanto em subpastas (ex.: GitHub Pages /carol-catalog/).
const CACHE_NAME = 'carol-catalog-v2';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => Promise.all(ASSETS.map((url) => cache.add(url).catch(() => null))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

// Navegação: rede primeiro (pega atualizações), cai para o cache quando offline.
// Demais recursos do mesmo domínio: cache primeiro.
self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req)
                .then((res) => {
                    const copy = res.clone();
                    caches.open(CACHE_NAME).then((c) => c.put('./index.html', copy));
                    return res;
                })
                .catch(() => caches.match('./index.html').then((r) => r || offlineFallback()))
        );
        return;
    }

    event.respondWith(
        caches.match(req).then((cached) => cached || fetch(req).then((res) => {
            if (res.ok) {
                const copy = res.clone();
                caches.open(CACHE_NAME).then((c) => c.put(req, copy));
            }
            return res;
        }).catch(() => new Response('', { status: 503, statusText: 'Offline' })))
    );
});

function offlineFallback() {
    return new Response(
        '<!DOCTYPE html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
        '<title>Sem conexão</title><body style="font-family:Georgia,serif;background:#f5e6e6;color:#333;text-align:center;padding:60px 20px">' +
        '<h1 style="color:#b07a7a">Sem conexão</h1><p>O catálogo ainda não foi salvo neste aparelho.<br>Abra uma vez com internet para usá-lo offline depois.</p></body></html>',
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
}
