export default class Config {
    static jsonupdates = { pre_num_row_pub: 0, pre_num_row_enc: 0, pre_num_row_cha: 0 };
    static urlParam = new URLSearchParams(window.location.search);
    static msgInit = '¡Qué emoción que te hayas unido a nuestra comunidad estratégica! Aquí encontrarás todas las herramientas necesarias para mejorar tus habilidades en Clash Royale. Queremos que aproveches al máximo todas las secciones disponibles en Clash Strategic, diseñadas específicamente para que te sientas como en Clash Royale.';

    static async renderTemplate(templateName, variables = {}) {
        console.log(`renderTemplate(${templateName}, ${JSON.stringify(variables)})`);
        try {
            const response = await fetch(`./src/templates/${templateName}.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlString = await response.text();

            const keys = Object.keys(variables);
            const values = Object.values(variables);
            // Using Function constructor is generally safe here as template strings are controlled internally
            const func = new Function(...keys, `return \`${htmlString}\`;`);

            return func(...values);
        } catch (error) {
            console.error(`Error rendering template ${templateName}:`, error);
        }
    }

    static setConfig() {
        console.log('setConfig()');
        !localStorage.getItem("sound_effects") && localStorage.setItem("sound_effects", "false");
        (!localStorage.getItem("base_url_api") || localStorage.getItem("base_url_api") == "https://clashstrategic.great-site.net/api") && localStorage.setItem("base_url_api", "https://clashstrategic.x10.mx/api");
    }

    static applyConfig() {
        console.log('applyConfig()');
        User.toggleSounds(localStorage.getItem("sound_effects"));
    }

    static isMobile() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }

    static installpwa(deferredPrompt) {
        console.log('installpwa(' + deferredPrompt + ')');
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            choiceResult.outcome === 'accepted' ? console.log('El usuario ha aceptado la instalación de la aplicación') : console.log('El usuario ha rechazado la instalación de la aplicación');
            deferredPrompt = null;
        });
    }

    static showInfBox(title, img, message, height) {
        console.log('showInfBox(' + title + ', ' + img + ', ' + message + ', ' + height + ')');
        $('#capa_contenido').fadeIn(250);
        $('#div_modal').fadeIn(250);
        $('#div_modal').css({ height: height + '%' });
        $('#conten_modal').html('<h3 class="cs-color-GoldenYellow">' + title + '</h3>' +
            '<img id="img_mod" src="./static/media/styles/modal/' + img + '">' +
            '<p class="cs-color-LightGrey">' + message + '</p><br><br><br><br>');
        $('#div_modal').append('<button class="cs-color-LightGrey" id="btn_mod">OK</button>');
    }

    static swActive() {
        console.log('swActive()');
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function (registrations) {
                if (registrations.length > 0) { //inicia CS
                    console.log('Service worker already registered.');
                } else {
                    console.log('No service worker registered.');
                    /* if (confirm("¿Deseas registrar el Service Worker para esta aplicación?")) {
                        location.href = './index';
                    } */
                }
            }).catch(function (error) {
                console.error('Error during service worker registration check:', error);
                // location.href = './index';
            });
        }
    }

    static setBody() {
        console.log('setBody()')
        let screenWidth = $(window).width();
        let numLines = 0;
        if (screenWidth <= 500) {
            numLines = 6;
        } else if (screenWidth > 500 && screenWidth <= 600) {
            numLines = 6;
        } else if (screenWidth > 600 && screenWidth <= 700) {
            numLines = 7;
        } else if (screenWidth > 700 && screenWidth <= 800) {
            numLines = 8;
        } else if (screenWidth > 800 && screenWidth <= 900) {
            numLines = 9;
        } else if (screenWidth > 900 && screenWidth <= 1000) {
            numLines = 10;
        } else if (screenWidth > 1000 && screenWidth <= 1250) {
            numLines = 12;
        } else if (screenWidth > 1250 && screenWidth <= 1500) {
            numLines = 15;
        } else {
            numLines = 17;
        }

        $('.line_diamond').empty(); // Limpiar el contenedor
        for (let i = 0; i < numLines; i++) {
            let line = $('<div>').addClass('line');
            for (let j = 0; j <= 20; j++) {
                line.append($('<div>').addClass('diamond'));
            }
            $('.line_diamond').append(line);
        }
    }

    static updates() {
        console.log('updates()');
        api({ updates: true, pre_num_row_cha: Config.jsonupdates.pre_num_row_cha, pre_num_row_pub: Config.jsonupdates.pre_num_row_pub, pre_num_row_enc: Config.jsonupdates.pre_num_row_enc }, 'update');
    }

    static hideAct() { //ocultar banner de nueva actualizacion
        console.log('hideAct()');
        let parts = Cookie.getCookie('dateBanHideAct').split('-');// Separar la fecha en día, mes y año
        new Date(parts[0], parts[1] - 1, parts[2]) <= new Date() && $('#div_ban_anu_act').remove();
    }

    //compresion webp
    static async comprimirYConvertir(archivos) {
        console.log('comprimirYConvertir(' + archivos + ')');
        return new Promise((resolve, reject) => {
            const webps = [];
            $.each(archivos, function (index, value) {
                const reader = new FileReader();
                reader.readAsDataURL(value);
                reader.onload = (event) => {
                    const img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob((webpBlob) => {
                            const ext = value.name.substring(value.name.lastIndexOf('.') + 1).toLowerCase();
                            if (ext === 'mp4' || ext === 'avi' || ext === 'mov' || ext === 'mkv' || ext === 'gif') {
                                reject({ message: 'Solo se aceptan imágenes', name: value.name });
                            } else if (value.size > 1024 * 1024) {
                                reject({ message: 'El archivo supera el tamaño máximo permitido de 1mb.', name: value.name });
                            } else {
                                ext === 'webp' ? webps.push(value) : webps.push(new File([webpBlob], `${value.name}.webp`, { type: 'image/webp' }));
                            }
                            webps.length === archivos.length && resolve(webps); //retornar el webps
                        }, 'image/webp', 0.7);
                    };
                };
            });
        });
    }

    static actualizarSW(date, version) { //actualizacion de la nueva version
        console.log('actualizarSW(' + date + ', ' + version + ')');
        alert("Nueva versión \"" + version + "\" disponible. Se actualizará a esta versión.");
        Config.unregisteredSw(date);
        //location.href = './index';
    }

    //ocultar ventanas
    static x_button(div_toggle) {
        console.log("x_button(" + div_toggle + ")");
        $('#capa_contenido').fadeOut(250);
        $('#img_model_card').remove();
        $('#div_card_info').empty();
        $('#h3_tog_gen_tit').html('');
        $('#div_tog_gen_con').html('<br><br><br><br>');
        if (div_toggle == 'div_perfilusu') {
            $('#' + div_toggle).empty().fadeOut(250, function () {
                $('.div_toggle').removeAttr('style'); //redimenciona div toggle para siguientes muestras
            });
            api({ publicaciones: true, typePub: 'pubAll' }, 'pub-all');
        } else {
            $('#' + div_toggle).fadeOut(250, function () {
                $('.div_toggle').removeAttr('style'); //redimenciona div toggle para siguientes muestras
            });
        }
        $('.div_toggle').off('scroll');
    }

    static reloadInacInWindow() { //funcion para recargar la pagina despues de un tiempo de inactividad
        let timeoutId;
        function resetTimeout() {// Función para reiniciar el temporizador
            clearTimeout(timeoutId);
            timeoutId = setTimeout(reloadPage, 900000);
        }
        function reloadPage() { // Función para recargar la página
            location.reload();
        }
        resetTimeout(); // Reiniciar el temporizador al cargar la página
        $(document).on('mousemove keydown click', resetTimeout);// Reiniciar el temporizador en los eventos de usuario
    }

    static addSlick(type, element, slidesToShow = 1, adaptiveHeight = false) {
        console.log('addSlick(' + element + ')');
        switch (type) {
            case 'vid':
                $(element).slick({
                    slidesToShow: slidesToShow,
                    slidesToScroll: 1,
                    infinite: false,
                    adaptiveHeight: adaptiveHeight
                });
                break;
            case 'img':
                $(element).slick({
                    slidesToShow: slidesToShow,
                    slidesToScroll: 1,
                    infinite: false,
                    adaptiveHeight: adaptiveHeight
                });
                break;
        }
    }

    static unregisteredSw(version) { //desregistrar los sw activos
        console.log('unregisteredSw()')
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function (registrations) {
                for (let registration of registrations) {
                    registration.unregister().then(function (success) {
                        if (success) {
                            console.log('Service Worker unregistered successfully.');
                            location.href = './index?v=' + version;
                        } else {
                            console.log('Service Worker unregistration failed.');
                            alert('Desregistro Servise Worker fallido');
                            return false;
                        }
                    });
                }
            }).catch(function (error) {
                console.error('Error fetching service workers:', error);
                return false;
            });
        } else {
            console.log('Service Workers are not supported in this browser.');
            alert('Servise Worker no es soportado en este navegador');
            return false;
        }
    }

    static showDivToggle(typeShow, Title = 'Title', Content = 'Sin Contenido') {
        console.log('showDivToggle(' + typeShow + ', ' + Title + ', ' + Content + ', )');
        $('#capa_contenido').fadeIn(250);
        switch (typeShow) {
            case 'showToggle': //muestra el toggle vacio cargando
                $('#div_tog_gen').fadeIn(250);
                break;
            case 'loadContent': //inerta el titulo y contenido al toggle
                $('#h3_tog_gen_tit').html(Title);
                $('#div_tog_gen_con').html(Content);
                break;
        };
    }

    static showAlert(htmlMessage) {
        console.log('showAlert(' + htmlMessage + ')');
        $('#div_alert_animation').html(htmlMessage).fadeIn(250);
        $('#div_alert_animation span').css({
            "font-size": "var(--fs-x-medium)",
            "text-shadow": "1px 1px var(--cs-color-DeepBlue)",
            width: "95%",
            position: "absolute",
            top: "80%",
            left: "50%",
            transform: "translate(-50%)"
        }).animate({ top: '75%' }, 3000, () => $('#div_alert_animation').fadeOut(125));
    }

    /**
     * Muestra una secuencia de mensajes de alerta uno tras otro.
     * Cada alerta aparece, anima un elemento span interno y luego desaparece
     * antes de que se muestre la siguiente.
     *
     * @param {string[]} messages - Un array de strings HTML representando cada mensaje de alerta.
     * @param {number} [index=0] - El índice del mensaje actual a mostrar (usado internamente para recursión).
     */
    static showAlertSequentially(messages, index = 0) {
        console.log('showAlertSequentially(' + messages + ', ' + index + ')');
        const alertContainer = $("#div_alert_animation");
        const currentMessageHtml = messages[index];
        const FADE_IN_DURATION = 250; //espera un pelin
        const ANIMATE_DURATION = 3000;
        const FADE_OUT_DURATION = 125; //oculta rápida
        const ANIMATE_TARGET_TOP = '75%';

        if (!Array.isArray(messages) || messages.length === 0) {
            console.warn("showAlertSequentially: Se requiere un array de mensajes no vacío.");
            return;
        }

        if (index >= messages.length) {
            alertContainer.empty().hide();
            console.log("showAlertSequentially: Secuencia de alertas completada.");
            return;
        }

        alertContainer.empty().append(currentMessageHtml).find('span').css({
            "font-size": "var(--fs-x-medium)",
            "text-shadow": "1px 1px var(--cs-color-DeepBlue)",
            width: "95%",
            position: "absolute",
            top: "80%",
            left: "50%",
            transform: "translate(-50%)"
        });

        alertContainer.fadeIn(FADE_IN_DURATION, function () {
            const spanElement = alertContainer.find('span');
            if (!spanElement.length) {
                alertContainer.delay(ANIMATE_DURATION)
                    .fadeOut(FADE_OUT_DURATION, function () {
                        Config.showAlertSequentially(messages, index + 1);
                    });
                return;
            }

            spanElement.animate({ top: ANIMATE_TARGET_TOP }, ANIMATE_DURATION, function () {
                alertContainer.fadeOut(FADE_OUT_DURATION, function () {
                    Config.showAlertSequentially(messages, index + 1);
                });
            });
        });
    };

    // --- Métodos Estáticos para Manejar Eventos de Click ---

    /**
     * Maneja el click en el botón de cerrar ('x') de un div toggle (como el perfil).
     * Llama al método x_button para cerrar el div correspondiente.
     * @param {jQuery} buttonElement - El elemento jQuery del botón 'x' clickeado.
     */
    static handleCloseToggleClick(buttonElement) {
        const toggleDivId = buttonElement.closest('.div_toggle').attr('id');
        if (toggleDivId) {
            Config.x_button(toggleDivId);
        } else {
            console.error("No se pudo encontrar el ID del div_toggle padre para el botón:", buttonElement);
        }
    }
}
