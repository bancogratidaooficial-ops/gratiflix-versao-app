const CACHE_NAME = 'gratiflix-dourado-v2';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// Instala e cacheia
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('GRATIFLIX Dourado instalado - Ganhe saldo!');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativa e limpa cache velho
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

// Busca - funciona offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Se tem no cache, usa, senão busca na internet
      return response || fetch(event.request).catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// Mensagem de bônus quando instalar
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'BONUS_INSTALACAO') {
    console.log('💰 Usuário instalou GRATIFLIX Dourado - +R$5,00 bônus!');
  }
});
