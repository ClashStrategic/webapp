export default class User {
    static name;
    static userInteracted = false;

    constructor() {
        this.name = "";
        this.userInteracted = false;
    }

    static toggleSounds(enable) {
        console.log('Toggle sounds:', enable);
        if (enable == 'true') {
            $('audio').prop('muted', false);
        } else {
            $('audio').prop('muted', true);
        }
    }

    /*     static notificacion(title, body, icon = 'logo_cs.webp') {
            if ('Notification' in window && 'serviceWorker' in navigator) {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        navigator.serviceWorker.register('./pwa/sw.js').then(registration => {
                            const opciones = {
                                body: body,
                                icon: './static/media/styles/notificacion/' + icon
                            };
                            const notificacion = new Notification(title, opciones); // Utiliza el nombre pasado como parámetro
                        });
                    }
                });
            }
        } */

    // --- Métodos Estáticos para Manejar Eventos de Click ---

    /**
     * Maneja el click en una imagen de banner para seleccionarla.
     * @param {jQuery} bannerElement - El elemento jQuery de la imagen de banner clickeada.
     */
    static handleSelectBannerClick(bannerElement) {
        $('.img_cam_banner').removeClass('img_cam_banner_active'); // Deseleccionar otros
        bannerElement.addClass('img_cam_banner_active'); // Seleccionar este
        $('#img_banner_per').attr('src', bannerElement.attr('src')); // Actualizar vista previa
        $('#inp_banner').val(bannerElement.data('banner')); // Actualizar input oculto
        console.log("Banner selected:", bannerElement.data('banner'));
    }

    /**
     * Maneja el click para mostrar/ocultar la información del jugador (API).
     * @param {jQuery} buttonElement - El elemento jQuery del botón clickeado.
     */
    static handleTogglePlayerInfoClick(buttonElement) {
        const infoDiv = $('#div_infjug');
        infoDiv.fadeToggle(250);
        // Si se está mostrando, llamar a la API
        if (infoDiv.is(':visible')) {
            // Asumiendo que 'api' es una función global o importada
            if (typeof api === 'function') {
                api({ dat: buttonElement.data('name'), type: 'api-usu', infjugador: true }, 'api-cla', buttonElement, buttonElement); // Pasando buttonElement como target y loader
            } else {
                console.error("La función 'api' no está definida.");
            }
        }
    }
    // --- Métodos Estáticos para Manejar Eventos de Submit ---

    /**
     * Maneja el submit del formulario para comprar monedas.
     * @param {jQuery} formElement - El elemento jQuery del formulario.
     */
    static handleGetCoinSubmit(formElement) {
        if (confirm('¿Esta Seguro de realizar esta compra?')) {
            submit(formElement.serialize(), 'get-coi', formElement, formElement.find('[type=submit]'));
        }
    }

    /**
     * Maneja el submit del formulario para comprar un emote.
     * @param {jQuery} formElement - El elemento jQuery del formulario.
     */
    static handleGetEmoteSubmit(formElement) {
        if (confirm('¿Desea Comprar el emote x 2500 monedas?')) {
            // Asumiendo que 'submit' es una función global o importada
            if (typeof submit === 'function') {
                submit(formElement.serialize(), 'get-emo', formElement, formElement.find('[type=submit]'));
            } else {
                console.error("La función 'submit' no está definida.");
            }
        }
    }

    /**
     * Maneja el submit del formulario para completar/verificar el tag del jugador.
     * @param {jQuery} formElement - El elemento jQuery del formulario.
     */
    static handleCompleteTagSubmit(formElement) {
        const tagInput = $('#inp_tag');
        const submitButton = $('#inp_sub_com_dat');
        // Asumiendo que 'submit' es una función global o importada
        if (typeof submit === 'function') {
            submit({ setTag: true, Tag: tagInput.val() }, 'set-tag', formElement, submitButton);
        } else {
            console.error("La función 'submit' no está definida.");
        }
    }

    /**
     * Maneja el submit del formulario de login.
     * @param {jQuery} formElement - El elemento jQuery del formulario.
     */
    static handleLoginSubmit(formElement) {
        const submitButton = formElement.find('[type=submit]');
        submitButton.css({ 'position': 'relative' }).append('<img class="img_loading" src="./static/media/styles/icons/menu/logo_cargando.gif">');
        // Asumiendo que 'Cookie.setCookiesForSession' y 'submit' son funciones globales o importadas
        if (typeof Cookie.setCookiesForSession === 'function' && typeof submit === 'function') {
            Cookie.setCookiesForSession(submitButton);
            submit(formElement.serialize(), 'log-usu', formElement, submitButton);
        } else {
            console.error("Las funciones 'Cookie.setCookiesForSession' o 'submit' no están definidas.");
            // Quitar el loading si hay error
            submitButton.find('.img_loading').remove();
        }
    }


    /**
     * Maneja el click para mostrar las notificaciones.
     */
    static handleShowNotificationsClick() {
        // Asumiendo que 'showDivToggle' y 'api' son funciones globales o importadas
        if (typeof showDivToggle === 'function' && typeof api === 'function') {
            showDivToggle('showToggle');
            api({ getNoty: true }, 'get-not', null, $('#div_tog_gen_con')); // Carga en el div general
        } else {
            console.error("Las funciones 'showDivToggle' o 'api' no están definidas.");
        }
    }

    /**
     * Maneja el click para mostrar la configuración.
     */
    static handleShowSettingsClick() {
        if (typeof showDivToggle === 'function' && typeof api === 'function') {
            showDivToggle('showToggle');
            Config.renderTemplate("SettingsView", { sound_effects: Cookie.getCookie("sound_effects") }).then(html => {
                showDivToggle('loadContent', 'Configuración', html);
            });
        } else {
            console.error("Las funciones 'showDivToggle' o 'api' no están definidas.");
        }
    }

    /**
     * Maneja el click para mostrar/ocultar el formulario de cambio de banner.
     */
    static handleToggleChangeBannerClick() {
        $('#div_cam_ban').slideToggle(500);
    }

    /**
     * Maneja el click para mostrar/ocultar el formulario de cambio de avatar.
     */
    static handleToggleChangeAvatarClick() {
        $('#div_cam_ava').slideToggle(500);
    }

    /**
     * Maneja el click para marcar una notificación como vista.
     * @param {jQuery} buttonElement - El elemento jQuery del botón clickeado.
     */
    static handleMarkNotificationSeenClick(buttonElement) {
        const notificationDiv = buttonElement.closest('.div_noty'); // Usar closest para robustez
        const notificationId = notificationDiv.data('idnot');
        if (notificationId && typeof api === 'function') {
            api({ VistaNotificaiones: true, id_Not: notificationId }, 'ins-vis', null, buttonElement); // Llama a la API
            // Opcional: Ocultar o cambiar estilo de la notificación inmediatamente
            // notificationDiv.fadeOut(250);
        } else {
            console.error("No se pudo obtener el ID de la notificación o la función 'api' no está definida.");
        }
    }

    /**
     * Maneja el click para mostrar los datos básicos del usuario.
     */
    static handleShowUserDataClick() {
        if (typeof showDivToggle === 'function' && typeof api === 'function') {
            showDivToggle('showToggle');
            let userData = {
                type: 'per',
                Usuario: sessionStorage.getItem('Usuario') || Cookie.getCookie('Usuario'),
                Avatar: sessionStorage.getItem('Avatar') || Cookie.getCookie('Avatar'),
                Banner: sessionStorage.getItem('Banner') || Cookie.getCookie('Banner'),
                Nombre: sessionStorage.getItem('Nombre') || Cookie.getCookie('Nombre'),
                Correo: sessionStorage.getItem('Correo') || Cookie.getCookie('Correo'),
                Tag: sessionStorage.getItem('Tag') || Cookie.getCookie('Tag'),
                TypeAcount: sessionStorage.getItem('TypeAcount') || Cookie.getCookie('TypeAcount'),
                State: sessionStorage.getItem('State') || Cookie.getCookie('State'),
                created_at: sessionStorage.getItem('created_at') || Cookie.getCookie('created_at'),
            }

            Config.renderTemplate("UserDataView", userData).then(html => {
                showDivToggle('loadContent', 'Mis Datos', html);
            });
        } else {
            console.error("Las funciones 'showDivToggle' o 'api' no están definidas.");
        }
    }

    /**
     * Registra la primera interacción del usuario con la página.
     * Se llama en eventos como mousemove, keydown, click, etc.
     */
    static handleUserInteraction() {
        if (!User.userInteracted) {
            User.userInteracted = true;
            console.log('User interaction detected.');
            // Aquí se podrían habilitar sonidos u otras funciones que requieran interacción previa.
        }
    }
}
