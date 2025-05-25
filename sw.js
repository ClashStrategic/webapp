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

function sendProgressUpdate(progress, msg) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({ type: 'progress', progress, msg });
    });
  });
}

self.addEventListener('install', event => {
  console.log('[SW] Instalando versión:', VERSION);
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cache abierto:', CACHE_NAME);
        return cache.addAll(urlsToCache)
          .then(() => {
            console.log('[SW] Archivos base (urlsToCache) cacheados.');
            sendProgressUpdate(75, 'Archivos base listos, descargando imágenes...');
            return fetchImageUrls();
          })
          .then(imageData => {
            const { files, size } = imageData;
            const imageProgressMsg = `Descargando ${files.length} imágenes (${size?.toFixed(2) || 'desconocido'} MB)`;
            console.log(`[SW] ${imageProgressMsg}`);
            sendProgressUpdate(85, imageProgressMsg);

            // Volver a abrir el cache o usar la instancia 'cache' si aún es válida en este scope.
            // Por seguridad, podemos reabrirlo o asegurarnos de que 'cache' sigue siendo el objeto correcto.
            return caches.open(CACHE_NAME).then(imageCache => {
              return Promise.all(files.map(url =>
                fetch(url, { cache: 'no-store' }) // Intentar asegurar una copia fresca de la imagen
                  .then(response => {
                    if (!response.ok) {
                      console.warn(`[SW] Fallo al obtener imagen ${url}: ${response.status}`);
                      return null; // No lanzar error para permitir que otras imágenes se cacheen
                    }
                    return imageCache.put(url, response.clone());
                  })
                  .catch(err => {
                    console.warn('[SW] No se pudo cachear imagen:', url, err);
                    return null; // Asegurar que Promise.all no se rechace prematuramente
                  })
              ));
            });
          });
      })
      .then(() => {
        console.log('[SW] Recursos cacheados correctamente');
        sendProgressUpdate(100, 'Recursos cacheados correctamente');
      })
      .catch(err => {
        console.error('[SW] Error durante la instalación:', err);
        sendProgressUpdate(0, 'Error al cachear los recursos');
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activando versión:', VERSION);
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name.startsWith('clash-strategic-webapp-'))
          .map(name => {
            console.log('[SW] Borrando cache antiguo:', name);
            return caches.delete(name);
          })
      )
    ).then(() => {
      console.log('[SW] Caches antiguos borrados. Reclamando clientes...');
      return self.clients.claim();
    }).then(() => {
      console.log('[SW] Clientes reclamados.');
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'ACTIVATED', version: VERSION });
        });
      });
    }).catch(err => {
      console.error('[SW] Error durante la activación:', err);
    })
  );
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
