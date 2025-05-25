const VERSION = '0.4.1';
const CACHE_NAME = `clash-strategic-webapp-${VERSION}`;
const urlsToCache = [
  'Frontend/src/js/main.js',
  'installsw.js',
  'Frontend/src/css/main.css',
  'index.html',
  'home.html',
  'error404.html',
  'error500.html',
  'maintenance.html',
  'PrivacyPolicy.html',
  'RefundPolicy.html',
  'TermsService.html'
];

let cachedProgress = null;

// Function to fetch image URLs from the server
function fetchImageUrls() {
  return fetch('list_images.php')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data)) return { files: data, size: 0 };
      if (data && typeof data === 'object') return { files: Object.values(data.allFiles), size: data.sizeAll };
      throw new Error('Respuesta inesperada al obtener imágenes');
    });
}

// Function to send messages to clients
function sendMessageToClients(progress, msg) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'progress', progress, msg });
    });
  });
}

self.addEventListener('install', event => {
  console.log('[SW] Instalando...');
  self.skipWaiting();

  event.waitUntil(
    fetchImageUrls()
      .then(imageData => {
        const { files, size } = imageData;
        cachedProgress = { progress: 85, msg: `Descargando ${size?.toFixed(2) || 'desconocido'}mb` };
        sendMessageToClients(cachedProgress.progress, cachedProgress.msg);
        console.log(`[SW] Caché de imágenes: ${files.length} archivos`);

        return caches.open(CACHE_NAME).then(cache => {
          return cache.addAll(urlsToCache).then(() => {
            return Promise.all(files.map(url =>
              caches.match(url).then(response =>
                response || cache.add(url).catch(err => console.warn('[SW] No se pudo cachear:', url, err))
              )
            ));
          });
        });
      })
      .then(() => {
        console.log('[SW] Recursos cacheados correctamente');
        sendMessageToClients(100, 'Recursos cacheados correctamente');
      })
      .catch(err => {
        console.error('[SW] Error durante la instalación:', err);
        sendMessageToClients(0, 'Error al cachear los recursos');
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activando...');
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name.startsWith('clash-strategic-webapp-'))
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );

  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'ACTIVATED', version: VERSION });
    });
  });
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(err => {
      console.error('[SW] Error en fetch:', err);
    })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
