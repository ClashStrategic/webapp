const VERSION = '1.2.3';
const DATETIME = '2025-07-01T12:36:59.295Z';
const CACHE_NAME = `clash-strategic-webapp-${VERSION}`;
const urlsToCache = [
  'src/js/main.js',
  'installsw.js',
  'src/css/main.css',
  'index.html',
  'home.html',
  'error404.html',
  'error500.html',
  'maintenance.html',
  'PrivacyPolicy.html',
  'RefundPolicy.html',
  'TermsService.html'
];

function addCacheBuster(url) {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${VERSION}&t=${Date.now()}`;
}

function getUrlFiles() {
  return fetch('list_url_files.php')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data)) return { files: data, size: 0 };
      if (data && typeof data === 'object') return { files: Object.values(data.allFiles), size: data.sizeAll };
      throw new Error('Respuesta inesperada al obtener archivos');
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
  console.log('[SW] Instalando versión:', VERSION, 'compilada el:', DATETIME);
  self.skipWaiting();

  event.waitUntil(
    caches.delete(CACHE_NAME)
      .then(() => {
        console.log('[SW] Cache anterior eliminado, creando nuevo cache:', CACHE_NAME);
        return caches.open(CACHE_NAME);
      })
      .then(cache => {
        console.log('[SW] Cache abierto:', CACHE_NAME);
        sendProgressUpdate(25, 'Descargando archivos base...');

        // Cachear archivos base con cache busting
        const urlsWithCacheBuster = urlsToCache.map(url => addCacheBuster(url));
        return Promise.all(urlsWithCacheBuster.map((url, index) =>
          fetch(url, {
            cache: 'no-cache',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache'
            }
          })
            .then(response => {
              if (!response.ok) {
                console.warn(`[SW] Fallo al obtener archivo base ${urlsToCache[index]}: ${response.status}`);
                return null;
              }
              // Guardar con la URL original (sin cache buster) para que el fetch funcione
              return cache.put(urlsToCache[index], response.clone());
            })
            .catch(err => {
              console.warn('[SW] No se pudo cachear archivo base:', urlsToCache[index], err);
              return null;
            })
        ))
          .then(() => {
            console.log('[SW] Archivos base cacheados.');
            sendProgressUpdate(50, 'Archivos base listos, obteniendo lista de archivos...');
            return getUrlFiles();
          })
          .then(imageData => {
            const { files, size } = imageData;
            const imageProgressMsg = `Descargando ${files.length} archivos adicionales (${size?.toFixed(2) || 'desconocido'} MB)`;
            console.log(`[SW] ${imageProgressMsg}`);
            sendProgressUpdate(75, imageProgressMsg);

            return Promise.all(files.map(url => {
              const urlWithCacheBuster = addCacheBuster(url);
              return fetch(urlWithCacheBuster, {
                cache: 'no-cache',
                headers: {
                  'Cache-Control': 'no-cache, no-store, must-revalidate',
                  'Pragma': 'no-cache'
                }
              })
                .then(response => {
                  if (!response.ok) {
                    console.warn(`[SW] Fallo al obtener archivo ${url}: ${response.status}`);
                    return null;
                  }
                  return cache.put(url, response.clone());
                })
                .catch(err => {
                  console.warn('[SW] No se pudo cachear archivo:', url, err);
                  return null;
                });
            }));
          });
      })
      .then(() => {
        console.log('[SW] Todos los recursos cacheados correctamente');
        sendProgressUpdate(100, 'Todos los recursos cacheados correctamente');
      })
      .catch(err => {
        console.error('[SW] Error durante la instalación:', err);
        sendProgressUpdate(0, 'Error al cachear los recursos');
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activando versión:', VERSION, 'compilada el:', DATETIME);
  event.waitUntil(
    caches.keys().then(cacheNames => {
      console.log('[SW] Caches encontrados:', cacheNames);
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Borrando cache antiguo:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Caches antiguos borrados. Reclamando clientes...');
      return self.clients.claim();
    }).then(() => {
      console.log('[SW] Clientes reclamados.');
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'ACTIVATED', version: VERSION, datetime: DATETIME });
        });
        console.log(`[SW] Notificación enviada a ${clients.length} clientes`);
      });
    }).catch(err => {
      console.error('[SW] Error durante la activación:', err);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        //console.log('[SW] Sirviendo desde cache:', event.request.url);
        return response;
      }

      // console.log('[SW] Obteniendo de la red:', event.request.url);
      return fetch(event.request).catch(err => {
        console.error('[SW] Error al obtener de la red:', event.request.url, err);
        if (event.request.destination === 'document') {
          return caches.match('/error404.html');
        }
        throw err;
      });
    }).catch(err => {
      console.error('[SW] Error en fetch:', err);
      throw err;
    })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
