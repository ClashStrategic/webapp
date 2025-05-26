function loadCS(progress, msg = 'Cargando Recursos...') {
    if (document.getElementById('span_msg_load') != null) {
        document.getElementById('span_msg_load').textContent = msg;
        document.getElementById('span_num_por').textContent = progress + '%';
        document.getElementById('div_porcentage').style.width = progress + '%';
    }
}

let swState = {
    callbackOnActiveExecuted: false,
    messageListenerAttached: false,
    isNewVersionInstalling: false,
    currentVersion: null,
    hasController: false,
    registrationPromise: null,
    isRealUpdate: false,
    previousVersion: null
};

function executeCallbackOnActiveOnce(callback) {
    if (!swState.callbackOnActiveExecuted && callback) {
        console.log("Ejecutando callbackOnActive por primera vez.");
        callback();
        swState.callbackOnActiveExecuted = true;
    } else if (swState.callbackOnActiveExecuted && callback) {
        console.log("callbackOnActive ya fue ejecutado, omitiendo llamada.");
    }
}

function showUpdateAlertAndReload() {
    console.log('Mostrando alerta de actualización y recargando página...');
    alert('¡Aplicación actualizada! La página se recargará para aplicar los cambios.');
    setTimeout(() => {
        window.location.reload();
    }, 500);
}

function detectNewVersionInstalling(registration) {
    const hasInstalling = !!registration.installing;
    const hasWaiting = !!registration.waiting;
    const hasController = !!navigator.serviceWorker.controller;

    swState.isNewVersionInstalling = (hasInstalling && hasController) || hasWaiting;
    swState.hasController = hasController;

    swState.previousVersion = localStorage.getItem('sw_version');
    swState.isRealUpdate = hasController && swState.previousVersion && swState.isNewVersionInstalling;

    console.log('Detección de nueva versión:', {
        hasInstalling,
        hasWaiting,
        hasController,
        isNewVersionInstalling: swState.isNewVersionInstalling,
        previousVersion: swState.previousVersion,
        isRealUpdate: swState.isRealUpdate
    });

    return swState.isNewVersionInstalling;
}

function setupMessageListener(callbackOnActive = null) {
    if (swState.messageListenerAttached) return;

    navigator.serviceWorker.addEventListener('message', event => {
        const data = event.data;
        if (!data) return;

        if (data.type === 'progress') {
            loadCS(data.progress, data.msg);
        }

        if (data.type === 'CACHE_COMPLETE') {
            loadCS(100, 'Cache Completado');
        }

        if (data.type === 'ACTIVATED') {
            console.log('SW activado (mensaje recibido de versión:', data.version, 'compilada el:', data.datetime, ')');

            const previousVersion = localStorage.getItem('sw_version');

            const isRealUpdate = previousVersion && previousVersion !== data.version && swState.hasController;

            console.log('Análisis de actualización:', {
                previousVersion,
                newVersion: data.version,
                hasController: swState.hasController,
                isRealUpdate
            });

            swState.currentVersion = data.version;
            localStorage.setItem('sw_version', data.version);
            localStorage.setItem('sw_datetime', data.datetime);
            loadCS(100, 'Service Worker Activado');

            if (isRealUpdate) {
                console.log('SW activado - actualización real detectada, mostrando alerta y recargando');
                showUpdateAlertAndReload();
            } else {
                console.log('SW activado - primera instalación o sin cambios, ejecutando callback');
                executeCallbackOnActiveOnce(callbackOnActive);
            }
        }

        if (data.type === 'CACHE_FAILED') {
            loadCS(100, 'Error de Cache: ' + data.msg);
        }

        if (data.type === 'UPDATE_FAILED') {
            loadCS(100, 'Error de Actualización: ' + data.msg);
        }
    });

    swState.messageListenerAttached = true;
}

function handleServiceWorkerStates(registration, callbackOnActive) {
    detectNewVersionInstalling(registration);

    if (registration.installing) {
        console.log('Service Worker instalándose.');
        const isUpdate = swState.hasController;

        if (isUpdate) {
            loadCS(50, 'Actualizando aplicación...');
            console.log('Actualización detectada - nueva versión instalándose');
        } else {
            loadCS(50, 'Cacheando Recursos Iniciales...');
            console.log('Primera instalación - cacheando recursos');
        }

        registration.installing.addEventListener('statechange', function handleStateChange() {
            console.log('SW state changed to:', this.state);

            if (this.state === 'installed') {
                if (registration.waiting) {
                    console.log('Nuevo SW instalado y esperando para activar (actualización lista).');
                    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                } else {
                    console.log('Nuevo SW instalado, se activará automáticamente.');
                }
            }

            if (this.state === 'activated') {
                console.log('SW activado después de instalación');
                swState.isNewVersionInstalling = false;

                if (isUpdate && swState.isRealUpdate) {
                    console.log('Actualización real completada - la alerta y recarga se manejarán en el mensaje ACTIVATED');
                } else if (isUpdate) {
                    console.log('Actualización completada - ejecutando callback');
                    executeCallbackOnActiveOnce(callbackOnActive);
                }
            }

            if (this.state === 'activated' || this.state === 'redundant') {
                this.removeEventListener('statechange', handleStateChange);
            }
        });

    } else if (registration.waiting) {
        console.log('Hay un Service Worker esperando para activar (actualización lista).');
        swState.isNewVersionInstalling = true;
        loadCS(75, 'Activando nueva versión...');
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    } else if (registration.active) {
        console.log('Service Worker ya está activo.');

        if (!swState.isNewVersionInstalling && !swState.callbackOnActiveExecuted) {
            console.log('SW ya activo - ejecutando callback inmediatamente');
            executeCallbackOnActiveOnce(callbackOnActive);
        }
    }
}

function installSW(callbackOnActive = null) {
    if (!('serviceWorker' in navigator)) {
        alert('Este navegador no soporta PWA. Usa otro navegador o actualízalo.');
        return Promise.reject(new Error('Service Worker no soportado'));
    }

    const controller = navigator.serviceWorker.controller;
    swState.hasController = !!controller;

    console.log('Estado inicial:', {
        hasController: swState.hasController,
        controller: controller ? 'presente' : 'ausente'
    });

    setupMessageListener(callbackOnActive);

    if (!controller) {
        loadCS(25, 'Iniciando Service Worker...');
    } else {
        loadCS(25, 'Verificando actualizaciones...');
    }

    swState.registrationPromise = navigator.serviceWorker.register('sw.js', { scope: './' })
        .then(registration => {
            console.log('SW registrado con éxito:', registration);
            loadCS(50, 'Procesando Service Worker...');

            handleServiceWorkerStates(registration, callbackOnActive);

            return registration;
        })
        .catch(err => {
            console.error('Error al registrar SW:', err);
            loadCS(100, 'Error al registrar el Service Worker');
            throw err;
        });

    window.addEventListener('beforeinstallprompt', e => e.preventDefault());
    window.addEventListener('appinstalled', () => console.log('PWA instalada'));

    return swState.registrationPromise;
}