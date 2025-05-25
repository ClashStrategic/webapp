
function loadCS(progress, msg = 'Cargando Recursos...') {
    if (document.getElementById('span_msg_load') != null) {
        document.getElementById('span_msg_load').textContent = msg;
        document.getElementById('span_num_por').textContent = progress + '%';
        document.getElementById('div_porcentage').style.width = progress + '%';
    }
}

if ('serviceWorker' in navigator) {
    loadCS(25, 'Iniciando...');
    window.addEventListener('load', () => {
        let updatePending = false;

        navigator.serviceWorker.register('sw.js', { scope: './' })
            .then(reg => {
                console.log('SW registrado con éxito:', reg);
                loadCS(50, 'Cacheando Recursos...');

                // Si ya hay uno esperando, activarlo inmediatamente
                if (reg.waiting) {
                    updatePending = true;
                    activateUpdate(reg.waiting);
                }

                // Detectar uno nuevo en instalación
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                updatePending = true;
                                activateUpdate(newWorker);
                            }
                        });
                    }
                });

                // Escuchar mensajes del SW
                navigator.serviceWorker.addEventListener('message', event => {
                    const data = event.data;
                    if (!data) return;

                    if (data.type === 'progress') loadCS(data.progress, data.msg);
                    if (data.type === 'CACHE_COMPLETE') loadCS(100, 'Cache Completado');
                    if (data.type === 'ACTIVATED') console.log('SW activado');
                    if (data.type === 'CACHE_FAILED') loadCS(100, 'Error: ' + data.msg);
                    if (data.type === 'UPDATE_FAILED') loadCS(100, 'Error actualización: ' + data.msg);
                });

                // Redirigir si no hay actualización pendiente
                if (!updatePending) {
                    loadCS(100, 'Listo');
                    setTimeout(() => {
                        location.href = 'home';
                    }, 500);
                }
            })
            .catch(err => {
                console.error('Error al registrar SW:', err);
                loadCS(50, 'Error al registrar el Service Worker');
            });

        // Forzar activación del nuevo SW
        function activateUpdate(worker) {
            console.log('Nueva versión detectada, activando...');
            worker.postMessage({ type: 'SKIP_WAITING' });

            // Esperar a que esté activado y recargar
            worker.addEventListener('statechange', () => {
                if (worker.state === 'activated') {
                    console.log('Nueva versión activada');
                    location.reload();
                }
            });
        }

        // PWA install events
        window.addEventListener('beforeinstallprompt', e => e.preventDefault());
        window.addEventListener('appinstalled', () => console.log('PWA instalada'));
    });
} else {
    alert('Este navegador no soporta PWA. Usa otro navegador o actualízalo.');
}