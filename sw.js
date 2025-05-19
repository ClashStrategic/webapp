const version = 'v5';
const CACHE_NAME = `v5`;
const urlsToCache = [
  'Frontend/src/js/main.js',
  'Frontend/src/css/main.css'
];

let cachedProgress = null;

// Function to fetch image URLs from the server
function fetchImageUrls() {
  return fetch('list_images.php') // Corrected path
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data)) {
        return data;
      } else if (data && typeof data === 'object') {
        return { files: Object.values(data.allFiles), size: data.sizeAll };
      } else {
        throw new Error('Error: La respuesta no es un array de URLs ni un objeto');
      }
    })
    .catch(error => {
      console.error('Error fetching image URLs:', error);
      throw error; // Re-throw the error to be caught by the waitUntil
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
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    fetchImageUrls()
      .then(imageUrls => {
        const imagesToCache = imageUrls.files;
        console.log('URLs de imágenes a verificar:', imagesToCache);
        cachedProgress = { progress: 85, msg: 'Descargando ' + imageUrls.size.toFixed(2) + 'mb' };
        sendMessageToClients(cachedProgress.progress, cachedProgress.msg);
        console.log('tamaño: ' + imageUrls.size.toFixed(2) + 'mb');

        return caches.open(CACHE_NAME)
          .then(cache => {
            console.log('Service Worker: Caché abierta');
            // Primero, cacheamos los archivos
            return cache.addAll(urlsToCache)
              .then(() => {
                // Luego, verificamos y cacheamos los arvhivos que se obtuvo con la fetchImageUrls
                return Promise.all(imagesToCache.map(url => {
                  return caches.match(url).then(cachedResponse => {
                    if (cachedResponse) {
                      console.log('Imagen ya en caché:', url);
                      return Promise.resolve();
                    } else {
                      console.log('Cacheando nueva imagen:', url);
                      return cache.add(url).catch(error => {
                        console.error('Error al cachear imagen:', url, error);
                      });
                    }
                  });
                }));
              });
          })
          .then(() => {
            console.log('Service Worker: Todos los recursos cacheados');
            self.skipWaiting();
            self.clients.matchAll().then(clients => {
              clients.forEach(client => {
                client.postMessage({ type: 'CACHE_COMPLETE' });
              });
            });
          });
      })
      .catch(error => {
        console.error('Error durante el proceso de cacheo:', error);
        // Handle the error appropriately, e.g., send a message to the client
        sendMessageToClients(0, 'Error al cachear los recursos');
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName.startsWith('v') && cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        );
      })
      .then(() => {
        if (cachedProgress) {
          sendMessageToClients(cachedProgress.progress, cachedProgress.msg);
        }
        return self.clients.claim();
      })
  );
  
  self.clients.matchAll().then(clients => {
    if (clients.length === 0) {
      console.log('No hay clientes activos durante la activación');
    } else {
      clients.forEach(client => {
        console.log('Enviando mensaje de activación a cliente:', client);
        client.postMessage({ type: 'ACTIVATED' });
      });
    }
  });
});
