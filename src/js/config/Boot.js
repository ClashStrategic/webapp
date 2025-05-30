export default class Boot {

    static msgInit = '¡Qué emoción que te hayas unido a nuestra comunidad estratégica! Aquí encontrarás todas las herramientas necesarias para mejorar tus habilidades en Clash Royale. Queremos que aproveches al máximo todas las secciones disponibles en Clash Strategic, diseñadas específicamente para que te sientas como en Clash Royale.';

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
}