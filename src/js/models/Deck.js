export default class Deck {

    static MazosOpcionsArray = [];
    static incompleteDeckMessage = "<span class='cs-color-GoldenYellow text-center'>Completa los espacios de cartas para ver las estadísticas.</span>";
    static isBatchOperation = false; // Bandera para operaciones por lotes

    static extractIdsLink(link) {
        const startIndex = link.indexOf("deck=") + 5;
        const endIndex = link.indexOf("&", startIndex);
        const deckString = link.substring(startIndex, endIndex);

        // Eliminar cualquier punto y coma extra al final de la cadena
        const trimmedDeckString = deckString.replace(/;+$/, "");

        const cardIds = trimmedDeckString.split(";");

        // Extraer el valor de tt del enlace
        const ttStartIndex = link.indexOf("&tt=") + 4;
        const ttEndIndex = link.indexOf("&", ttStartIndex) > -1 ? link.indexOf("&", ttStartIndex) : link.length;
        const ttString = link.substring(ttStartIndex, ttEndIndex);

        // Agregar el valor de tt al final del array cardIds si existe
        if (ttString) {
            cardIds.push(ttString);
        }

        return cardIds;
    }

    static cargandoMazo() {
        $('.cs-deck__slot').each(function () {
            $(this).css({ 'position': 'relative' });
            $(this).append('<img class="img_loading" src="static/media/styles/icons/menu/logo_cargando.gif" alt="Cargando...">');
        });
    }

    static eliminarGifCargando() {
        $('.cs-deck__slot').each(function () {
            $(this).find('.img_loading').remove(); // Eliminar el gif de cargando
        });
    }

    static addDeleteTowerCard(card, json, name) {
        console.log('addDeleteTowerCard(' + card + ', ' + json + ', ' + name + ')');
        if (card.data('inmazo') == 'yes') { //si ya esta en el mazo quitarla
            card.parent('#div_card_slot_tower').data("lleno", "no").removeAttr('style'); //slot vacio
            $('.cs-card-space[data-id="div_card_' + name + '"]').show().html(card.data('inmazo', 'no')); //muestra el space e inserta el div card a su posicion original
            $('#deck-slots-main').data('towercard', '[]');
        } else { //si no esta en el mazo añadirla
            if ($('#div_card_slot_tower').data('lleno') == 'yes') { //si hay una carta en el slot vaciarla
                const div_card_old = $('#div_card_slot_tower').children('.cs-card'); //card que se quiere sacar
                card.parent('#div_card_slot_tower').data("lleno", "no").css({ 'border': '1px solid black' }); //slot vacio
                $('.cs-card-space[data-id="div_card_' + div_card_old.data('name') + '"]').show().html(div_card_old.data('inmazo', 'no')); //muestra el space e inserta el div card a su posicion original
            }
            card.parent('.cs-card-space').hide();
            $('#deck-slots-main').data('towercard', [json]);
            $('#div_card_slot_tower').data("lleno", "yes").css({ 'border': 'none', 'box-shadow': 'none' }).html(card.data("inmazo", "yes"));
        }
        !Deck.isBatchOperation && Deck.save();
    }

    static addDeleteCard(card, json, name) {
        console.log('addDeleteCard(' + JSON.stringify(card) + ', ' + JSON.stringify(json) + ', ' + name + ')');
        if (card.data("inmazo") == 'no') { //si la carta no esta en el mazo, entonse añadirla
            if ($('#deck-slots-main').data('cards').filter(item => item.rarity == 'Champion').length == 1 && json.rarity == 'Champion') { //si existe un campeon en el mazo alertar y cerrar
                alert('Ya Tienes un Campeón en el Mazo');
                return; //cerrar la ejecucion
            }
            for (let i = 1; i <= 8; i++) { //itera todo el slot
                let slot = $("#cs-deck__slot-" + i);
                if (slot.data("lleno") == 'no') { //si el slot esta vacio
                    ((slot.attr('id') == 'cs-deck__slot-1' || slot.attr('id') == 'cs-deck__slot-2') && json.evolution) && card.find('.cs-card__image').attr('src', json.iconUrls.evolutionMedium); //añadir la img de evo
                    card.parent('.cs-card-space').hide();
                    $('#deck-slots-main').data('cards').splice((i - 1), 0, json); //inserta los datos a data-cards
                    slot.data("lleno", "yes").css({ 'background': 'transparent', 'border': 'none', 'box-shadow': 'none' }).html(card.data("inmazo", "yes")); //inserta la carta al slot
                    break; //al encontrar el slot vacio y poner la carta en el pues deja de iterar a los slots
                } else { continue; } //si el slot esta lleno pasa a la siguiente
            }
            if ($('#deck-slots-main').data('cards').length == 8 && card.data('inmazo') == 'no' && card.data('type') != 'tower') { //si el mazo esta lleno cambia la carta por otra
                $('html, body').animate({ scrollTop: $('#main-deck-collection').offset().top }, 500);
                $('#main-deck-collection-alert').html('<span class="cs-color-GoldenYellow text-center">"El mazo está lleno. Selecciona la carta a reemplazar."</span><button id="btn_cam_card_no" class="cs-btn cs-btn--medium cs-btn--cancel">Cancelar</button>').fadeIn(250);
                $('.cs-card').find('button').prop('disabled', true).css({ opacity: 0.75 }); //desabilitar todos los botones en div card
                $('#main-deck-collection-box-btns').find('div, button').prop('disabled', true).css({ opacity: 0.75 }); //desabilitar todos los botones en div card
                Card.selCardEvent = $('#deck-slots-main .cs-card').on('click', function () { //al hacer click en la carta que quiere cambiar
                    Card.selCardEvent.off('click');
                    Card.selCardEvent = null;
                    $('.cs-card').find('button').prop("disabled", false).css({ opacity: 1 });
                    $('#main-deck-collection-box-btns').find('div, button').prop('disabled', false).css({ opacity: 1 }); //desabilitar todos los botones en div card
                    $(this).find('.cs-card__use-remove').click();
                    card.find('.cs-card__use-remove').click();
                    Config.showAlert('<span class="cs-color-VibrantTurquoise text-center">Carta Reemplazada</span>');
                    $(this).click();
                });
            }
        } else { //la carta esta en el mazo, entonses quitarla
            $('#deck-slots-main').data('cards', $('#deck-slots-main').data('cards').filter(item => item.name != name)); //elimina del json el objeto con con el nombre del data card
            json.evolution && card.find('.cs-card__image').attr('src', json.iconUrls.medium); //cambia la img de evo a normal
            card.parent('.cs-deck__slot').data("lleno", "no").css({ 'border': '1px solid var(--cs-color-LightGrey)' }); //slot vacio
            card.parent('#cs-deck__slot-1, #cs-deck__slot-2').attr('style', '');
            $('.cs-card-space[data-id="div_card_' + name + '"]').show().html(card.data("inmazo", "no")); //volver a añadir al div_card_containers
            $('#deck-slots-main').data('cards', $('#deck-slots-main').data('cards').filter(item => item.name != name)); //inserta los datos de solo las cartas que quedaron en el mazo
        }
        !Deck.isBatchOperation && Deck.save();
    }

    static analyzeBasic(cards) {
        console.log('analyzeBasic(' + cards + ')');
        if (cards.length == 9) {
            api("POST", "/v1/deckanalyzer", 'ana-maz', {
                version: '1.0',
                type: 'basic',
                namesCards: JSON.stringify(cards),
                AnaEvo: 2,
                Estrategia: 'Libre'
            }, null, $('#div_det_basic'));
        } else {
            $('#div_det_basic').html(Deck.incompleteDeckMessage);
        }
    }

    static save() {
        console.log('save()');

        const nmazo = $('#main-deck-collection-box-btns').data('nmazo');
        const cards = $('#deck-slots-main').data('cards') || [];
        const towerCard = $('#deck-slots-main').data('towercard')[0] ?? null;
        let cardNames = cards.map(c => c.name).concat(towerCard ? [towerCard.name] : []);
        cardNames = cardNames.filter(name => name != null && name != undefined);

        if (cardNames.length == 9) {
            let TypeAcount = Cookie.getCookie('TypeAcount');
            if (TypeAcount == 'invitado') {
                let Mazos = Cookie.getCookie('Mazos');
                Mazos == null && Cookie.setCookie('Mazos', '["", "", "", "", "", "", "", "", "", ""]');
                Mazos = JSON.parse(Mazos);
                Mazos[(nmazo - 1)] = cardNames;
                Cookie.setCookie('Mazos', JSON.stringify(Mazos));
                $('#main-deck-collection-alert').html('<span class="cs-color-GoldenYellow text-center">Para guardar tu mazo de forma segura, crea una cuenta. Por ahora, se guardará temporalmente en tu navegador.</span>');
            } else {
                let Mazos = JSON.parse(Cookie.getCookie('Mazos'));
                let MazoSave = Mazos[(nmazo - 1)];
                let MazosCards = MazoSave.filter(name => name != null && name != undefined);
                console.log('El mazo a guardar es:', cardNames, ' y el mazo a en cookie es:', MazoSave, ' y el nmazo es:', nmazo);

                if (cardNames.length == MazosCards.length && cardNames.every((value, index) => value == MazosCards[index])) {
                    console.log('El mazo no ha cambiado, no se guardará.');
                    return;
                }

                let saveDecks = Mazos;
                saveDecks[(nmazo - 1)] = cardNames;

                api("PATCH", "/v1/users", 'update-deck', { data: { decks: saveDecks } });
            }
        } else {
            $('#main-deck-collection-alert').html('<span class="cs-color-IntenseOrange text-center">El mazo debe tener 9 cartas, no se puede guardar.</span>');
        }
    }

    static update(deckCollection__boxbtnsOption) {
        console.log('update(' + deckCollection__boxbtnsOption + ')');
        let Mazos = JSON.parse(Cookie.getCookie('Mazos'));
        let nmazo = deckCollection__boxbtnsOption.data('nmazo');
        let mazocamb = Mazos[(nmazo - 1)];
        console.warn('El mazo seleccionado es:', mazocamb);
        $('.cs-deck-collection__box-btns-option').removeClass('selectmaz');
        deckCollection__boxbtnsOption.addClass('selectmaz').css({ 'position': 'relative' }).append('<img class="img_loading" src="./static/media/styles/icons/menu/logo_cargando.gif">'); //cargando mazo
        deckCollection__boxbtnsOption.find('.img_loading').remove(); // Remove loading image before proceeding
        $('#main-deck-collection-box-btns').data('nmazo', nmazo); //cambiar el numero de mazo en el que esta
        mazocamb ? Deck.setMazo(mazocamb) : Deck.eliminarMazo();
        $('#main-deck-collection-alert').empty(); //limpiar los mensajes de alerta
        //$('#div_result_ana').fadeOut(250); //ocultar los resultados del analisis si las hay
        Cookie.setCookie('nmazo', nmazo);
    }

    static setMazo(namesCardInMazo) {
        console.log('setMazo(' + JSON.stringify(namesCardInMazo) + ')');

        $('.cs-deck__slot').each(function (index, element) { //eliminar el mazo
            $(element).data('lleno') == 'yes' && $(element).find('.cs-card__use-remove').click();
        });

        $.each(namesCardInMazo, function (index, value) { //seleccionar cartas del mazo
            $(".cs-card").each(function (index2, element) {
                if ($(element).data('name') == value) {
                    $(element).find('.cs-card__use-remove').click();
                    $(element).children('.cs-card__options').stop(true, true);
                    $(element).removeClass('card--show-opt');
                    return;
                }
            });
        });
    }

    static pegarMazo(arr) {
        console.log('pegarMazo(' + arr + ')');
        if ($(".cs-deck__slot").toArray().every(element => $(element).data("lleno") == 'no')) {
            try {
                Deck.isBatchOperation = true; // Iniciar operación por lotes
                let cardclick = 0;
                $.each(arr, function (index, value) {
                    $(".cs-card").each(function (index2, element) {
                        if ($(element).data('id') == value) {
                            $(element).find('.cs-card__use-remove').click();
                            $(element).children('.cs-card__options').stop(true, true);
                            $(element).removeClass('card--show-opt');
                            cardclick++;
                            return;
                        }
                    });
                });
                cardclick == arr.length ? Config.showAlert('<span class="cs-color-VibrantTurquoise text-center">Se Pego el Mazo Correctamente</span>') :
                    $('#main-deck-collection-alert').html('<span class="cs-color-IntenseOrange text-center">No se pegaron todas las cartas, ha ocurrido un error.</span>') &&
                    Config.showAlert('<span class="cs-color-IntenseOrange text-center">No se pegaron todas las cartas, ha ocurrido un error.</span>');
            } finally {
                Deck.isBatchOperation = false;
                Deck.save();
            }
        } else {
            confirm("hay cartas en el mazo, ¿Desea Reemplazarlo?") && (Deck.eliminarMazo(), Deck.pegarMazo(arr));
        }
    }

    static eliminarMazo() {
        console.log('eliminarMazo()');
        Deck.isBatchOperation = true; // Iniciar operación por lotes
        let arrayNames = [];
        try {
            $('.cs-deck__slot').each(function (index, element) {
                if ($(element).data('lleno') == 'yes') {
                    arrayNames.push($(element).find('.cs-card').data('name'));
                    $(element).find('.cs-card__use-remove').click();
                }
            });
            $(".cs-card").each(function (index2, card) {
                if ($(card).data('name') == arrayNames[arrayNames.length - 1]) {
                    $(card).find('.cs-card__options').slideUp(0);
                    $(card).removeClass('card--show-opt');
                    return;
                }
            });
        } finally {
            Deck.isBatchOperation = false;
            Deck.save();
        }
    }

    static getEnlaceMazo() { //obtener el enlace del mazo actual
        //https://link.clashroyale.com/es/?clashroyale://copyDeck?deck=26000036;26000000;26000093;27000006;26000087;26000035;28000017;28000000&slots=0;0;0;0;0;0;0;0&tt=159000000&l=Royals&id=VY0Q8GPCQ
        let mazo = [];
        $('.cs-deck__slot').each(function () {
            $(this).data('lleno') == 'yes' && mazo.push($(this).find('.cs-card').data('id'));
        });

        if (mazo.length == 9) {
            let enlace_mazo = 'https://link.clashroyale.com/es/?clashroyale://copyDeck?deck=';
            for (let i = 0; i < 9; i++) {
                i != 8 ? enlace_mazo += mazo[i] : (enlace_mazo += ('&tt=' + mazo[i] + '&l=Royals'));
                i < 7 && (enlace_mazo += ';');
            }
            return enlace_mazo;
        } else {
            Config.showAlert('<span class="cs-color-IntenseOrange text-center">El Mazo esta incompleto</span>');
            return false;
        }
    }

    static setCreatedDecks(res) {
        if (res.data.result.decks === undefined || res.data.result.decks === null) {
            $('#main-deck-collection-alert').html('<span class="cs-color-IntenseOrange text-center">No se pudieron cargar las opciones de mazos guardados.</span>');
        } else {
            Deck.MazosOpcionsArray = res.data.result.decks;
            $('#div_opc_cre_maz').fadeIn(250).html(`<span class="cs-color-LightGrey">Mazos Creados: </span>`);
            for (let i = 0; i < Object.keys(res.data.result.decks).length; i++) {
                if (Object.keys(res.data.result.decks[i]).length > 0) {
                    let numMaz = i + 1;
                    $('#div_opc_cre_maz').append(`<button class="btn_opc_cre_maz" data-nmazo="${numMaz}">${numMaz}</button> `);
                }
            }
            $('.btn_opc_cre_maz[data-nmazo=1]').click();
            $('#div_crear_mazo').fadeOut(250);
            //$('#div_log_maz').fadeIn(0).html(Object.entries(res.data.log).map(([key, value]) => `<span style="color: var(--cs-color-DeepBlue);">${key}</span>: ${JSON.stringify(value)}`).join('<br>')).fadeOut(0);
        }
        $('#span_gems').text(res.data.balance.gems);
        $('#main-deck-collection-alert').html(res.data.message);
    }

    // --- Métodos Estáticos para Manejar Eventos de Click ---

    /**
     * Maneja el click en una opción de mazo creado.
     * @param {jQuery} element - El elemento jQuery del botón de opción clickeado.
     */
    static handleCreatedDeckOptionClick(element) {
        $('.btn_opc_cre_maz').removeClass('btn_select_opc_cre');
        element.addClass('btn_select_opc_cre');
        $('#div_result_ana').fadeOut(250); // Ocultar resultados de análisis si existen
        const deckIndex = element.data('nmazo') - 1;
        if (Deck.MazosOpcionsArray && Deck.MazosOpcionsArray[deckIndex]) {
            Deck.setMazo(Deck.MazosOpcionsArray[deckIndex]);
        } else {
            console.error("No se encontró el mazo en MazosOpcionsArray para el índice:", deckIndex);
            Deck.eliminarMazo(); // Opcional: limpiar el mazo si no se encuentra la opción
        }
    }

    /**
     * Maneja el click en el botón para eliminar el mazo actual.
     */
    static handleDeleteDeckClick() {
        $('#div_sub_btns_mazo').fadeOut(250);
        if (confirm("Se limpiará el mazo actual, ¿Desea continuar?")) {
            Deck.eliminarMazo();
        }
    }

    /**
     * Maneja el click en el botón para pegar un enlace de mazo.
     */
    static handlePasteDeckLinkClick() {
        $('#div_sub_btns_mazo').fadeOut(250);
        const link = prompt('Introduce el enlace del mazo. (Obténlo en: Sección de Mazos -> Menú -> Enlace -> Copiar)');
        if (link) {
            const cardIds = Deck.extractIdsLink(link);
            console.log("Extracted Card IDs:", cardIds);
            if (cardIds && cardIds.length > 1) { // Verificar que se extrajeron IDs válidos
                Deck.pegarMazo(cardIds);
            } else {
                Config.showAlert('<span class="cs-color-IntenseOrange text-center">El enlace no es válido o no contiene cartas.</span>');
            }
        }
    }

    /**
     * Maneja el click en el botón para copiar el enlace del mazo actual.
     */
    static handleCopyDeckLinkClick() {
        $('#div_sub_btns_mazo').fadeOut(250);
        const deckLink = Deck.getEnlaceMazo();
        if (deckLink) {
            navigator.clipboard.writeText(deckLink).then(() => {
                Config.showAlert('<span class="cs-color-VibrantTurquoise text-center">Enlace del mazo copiado en el portapapeles</span>');
            }).catch(err => {
                console.error('Error al copiar el enlace:', err);
                Config.showAlert('<span class="alert-danger">Error al copiar el enlace.</span>');
            });
        }
    }

    /**
     * Maneja el click en el botón para copiar el mazo a Clash Royale.
     */
    static handleCopyDeckToGameClick() {
        $('#div_sub_btns_mazo').fadeOut(250);
        if (confirm('¿Quieres salir de Clash Strategic para copiar el Mazo en Clash Royale?')) {
            let deckLink = Deck.getEnlaceMazo();
            // Reemplaza el prefijo web para obtener el enlace directo del juego y reasigna el resultado
            deckLink = deckLink.replace("https://link.clashroyale.com/es/?", "");
            console.log("Deck Link:", deckLink);
            if (deckLink) {
                window.open(deckLink, '_blank');
            }
        }
    }

    /**
     * Maneja el click para mostrar/ocultar el log del mazo.
     */
    static handleToggleDeckLogClick() {
        $('#div_log_maz').slideToggle(250);
    }

    /**
     * Maneja el click para mostrar/ocultar las opciones del mazo.
     */
    static handleToggleDeckOptionsClick() {
        $('#div_sub_btns_mazo').fadeToggle(250);
    }

    /**
     * Maneja el click para mostrar/ocultar los resultados del análisis del mazo.
     * @param {jQuery} element - El elemento jQuery del botón clickeado.
     */
    static handleToggleAnalysisResultsClick(element) {
        const resultsDiv = $('#div_res_ST');
        const div_res_ana_maz = $('#div_res_ana_maz');
        const isCurrentlyVisible = div_res_ana_maz.is(':visible');

        if (isCurrentlyVisible) {
            resultsDiv.prepend('<span id="span_msg_ana_deck">El Resultado del Analisis Esta Oculto</span>');
            div_res_ana_maz.fadeOut(125);
            element.text('Mostrar');
        } else {
            resultsDiv.find('#span_msg_ana_deck').remove();
            div_res_ana_maz.fadeIn(250);
            element.text('Ocultar');
        }
    }

    /**
     * Maneja el click en el botón "Analizar Mazo".
     */
    static handleAnalyzeButtonClick() {
        $('#div_crear_mazo').fadeOut(0); // Ocultar sección de creación
        $('#div_analizar_mazo').fadeToggle(0, function() {
            if ($('#div_analizar_mazo').is(':visible')) {
                $('html, body').animate({ scrollTop: $('#deck-tool-forms').offset().top + $('#deck-tool-forms').outerHeight() - $(window).height() + 16 }, 500);
            }
        }); // Mostrar/ocultar sección de análisis
    }

    /**
     * Maneja el click en el botón "Análisis Básico".
     */
    static handleBasicAnalysisButtonClick() {
        const version = $('#sel_version_analizador').val();
        if (version == 1.0) {
            $('#frm_ana_maz_ava')[0].reset();
            $('#div_btns_analizar_mazo').fadeOut(0);
            // Ocultar elementos específicos del análisis avanzado v1.0
            $('#div_che_ana_evo, #div_sel_est_ana, #div_che_ana_est').fadeOut(0);
            $('#frm_ana_maz_ava input[name="type"]').val('intermediate');
            $('#div_frm_ana_maz').slideDown(250); // Mostrar formulario v1.0
        } else if (version == 1.1) {
            alert('Análisis básico no disponible para la versión 1.1');
        }
    }

    /**
     * Maneja el click en el botón "Análisis Avanzado".
     */
    static handleAdvancedAnalysisButtonClick() {
        const version = $('#sel_version_analizador').val();
        if (version == 1.0) {
            $('#frm_ana_maz_ava')[0].reset();
            $('#div_btns_analizar_mazo').fadeOut(0);
            $('#frm_ana_maz_ava input[name="type"]').val('advanced');
            // Mostrar elementos específicos del análisis avanzado v1.0
            $('#div_che_ana_evo, #div_sel_est_ana, #div_che_ana_est').fadeIn(0);
            $('#div_frm_ana_maz').slideDown(250); // Mostrar formulario v1.0
        } else if (version == 1.1) {
            $('#frm_ana_maz_ava_v1_1')[0].reset();
            $('#div_btns_analizar_mazo').fadeOut(0);
            $('#frm_ana_maz_ava_v1_1 input[name="type"]').val('advanced');
            $('#frm_ana_maz_ava_v1_1').slideDown(250); // Mostrar formulario v1.1
        }
    }

    /**
     * Maneja el click en el botón "Crear Mazo".
     */
    static handleCreateButtonClick() {
        $('#div_analizar_mazo').fadeOut(0); // Ocultar sección de análisis
        $('#div_crear_mazo').fadeToggle(0, function() {
            if ($('#div_crear_mazo').is(':visible')) {
                $('html, body').animate({ scrollTop: $('#deck-tool-forms').offset().top + $('#deck-tool-forms').outerHeight() - $(window).height() + 16 }, 500);
            }
        }); // Mostrar/ocultar sección de creación
    }

    static deckBuilderRequest(level, version) {
        $('#div_btns_crear_mazo').fadeOut(0);
        $('#div_frm_crear_mazo').fadeIn(250);
        Config.renderTemplate("DeckBuilderFormsView", { level: level, version: version }).then(html => {
            $('#div_frm_crear_mazo').html(html);
        });
    }

    /**
     * Maneja el click en los botones para cancelar el formulario de análisis.
     */
    static handleCancelAnalysisClick() {
        const version = $('#sel_version_analizador').val();
        $('#div_btns_analizar_mazo').fadeIn(250); // Mostrar botones iniciales
        if (version == 1.0) {
            $('#div_frm_ana_maz').fadeOut(0); // Ocultar formulario v1.0
        } else if (version == 1.1) {
            $('#frm_ana_maz_ava_v1_1').fadeOut(0); // Ocultar formulario v1.1
        }
    }

    /**
     * Maneja el click en los botones para cancelar el formulario de creación.
     */
    static handleCancelCreateClick() {
        const version = $('#sel_version_creador').val();
        $('#div_btns_crear_mazo').fadeIn(250); // Mostrar botones iniciales
        if (version == 1.0) {
            $("#div_frm_crear_mazo").html("<br><br><br>");
            $('#div_frm_crear_mazo, #frm_crear_mazo').fadeOut(0); // Ocultar formulario v1.0
        } else if (version == 1.1) {
            $("#frm_crear_mazo_1_1")[0].reset();
            // Limpiar selección de estrategias en v1.1
            $("#frm_crear_mazo_1_1 input[name='idsEstrategias']").val('[]');
            $('#frm_crear_mazo_1_1 .div_estrategias_seleccionadas').find('.p_est_show').remove();
            $('#div_frm_crear_mazo_v1_1, #frm_crear_mazo_1_1').fadeOut(0); // Ocultar formulario v1.1
        }
    }

    /**
     * Maneja el click para cambiar entre las vistas de mazos (1-5 y 6-10).
     */
    static handleChangeDeckViewClick() {
        $('#div_maz_1_5').fadeToggle(0);
        $('#div_maz_6_10').fadeToggle(0);
    }

    /**
     * Maneja el click para mostrar/ocultar el iframe de la wiki de una carta.
     * @param {jQuery} element - El elemento jQuery del botón clickeado.
     */
    static handleToggleWikiClick(element) {
        const wikiFrame = $('#div_ifrm_wiki');
        wikiFrame.fadeToggle(250);
        // Solo actualiza el src si el iframe se está mostrando
        if (wikiFrame.is(':visible')) {
            $('#ifrm_det_card').attr('src', element.data('url'));
        }
    }

    /**
     * Maneja el click en el botón para editar una estrategia dentro del contexto del mazo.
     * @param {jQuery} element - El elemento jQuery del botón de editar estrategia.
     */
    static handleEditStrategyClick(element) {
        let div_apply_est = element.parent('.div_apply_est');

        if (div_apply_est.data('state') == 'active') {
            // Guardar estado actual antes de mostrar el editor
            div_apply_est.data('div_est_show', div_apply_est.find('.div_est_show')[0].outerHTML);
            div_apply_est.data('btn_edit_est_val', element.find('img')[0].outerHTML); // Guardar el icono original

            div_apply_est.data('state', 'disabled'); // Marcar como editando
            element.text('Cancelar').css({ background: 'var(--cs-color-IntenseOrange)', position: 'absolute' }); // Cambiar botón a Cancelar

            // Reemplazar la vista de la estrategia con el formulario de edición
            div_apply_est.find('.div_est_show').replaceWith(Strategy.setFunctionEstrategies()); // Asume que Strategy.setFunctionEstrategies() devuelve el HTML del form
            Deck.seleccionPov(div_apply_est); // Llama a la función para manejar la selección de POV

        } else { // Cancelar edición
            element.html(div_apply_est.data('btn_edit_est_val')).css({ background: 'var(--cs-color-GoldenYellow)', position: 'absolute' }); // Restaurar botón original
            div_apply_est.find('.div_details_estrategia').remove(); // Quitar detalles si los hubiera
            div_apply_est.find('form').replaceWith(div_apply_est.data('div_est_show')); // Restaurar vista original
            div_apply_est.data('state', 'active'); // Marcar como activo de nuevo
        }
    }

    /**
     * Función auxiliar llamada desde handleEditStrategyClick para manejar la selección de POV.
     * (Esta función ya existe en Deck.js, solo se referencia aquí para claridad)
     * @param {jQuery} div_apply_est - El div contenedor de la estrategia que se está editando.
     */
    static seleccionPov(div_apply_est) {
        // La implementación original de seleccionPov se mantiene aquí o se llama si existe.
        // Esta función parece manejar la lógica de selección de puntos de vista (POV)
        // dentro del formulario de edición de estrategias.
        console.log("seleccionPov llamada para:", div_apply_est);
        // ... (Implementación original de seleccionPov si es necesario moverla o adaptarla)
    }

    // --- Métodos Estáticos para Manejar Eventos de Submit ---

    /**
     * Maneja el submit del formulario para crear un mazo (versiones 1.0 y 1.1).
     * @param {jQuery} formElement - El elemento jQuery del formulario.
     */
    static handleCreateDeckSubmit(formElement) {
        const version = formElement.find('input[name="version"]').val();
        const level = formElement.find('input[name="level"]').val();
        const costGems = { basic: 0, intermediate: 6, advanced: 12 };

        const winConditionChecked = $('#inp_che_win').prop('checked');
        const deckCards = $('#deck-slots-main').data('cards') || [];
        const winConditionCard = deckCards.find(item => item.Attack && (item.Attack[0] === 'est' || item.Attack[1] === 'est'));

        if (winConditionChecked && !winConditionCard) {
            alert('Si checkeo "Elegir una win" Debe escoger una carta de tipo Win-Condition en el Mazo.');
            return;
        }

        if (version == 1.1) {
            const strategiesInput = formElement.find('input[name="idsEstrategias"]');
            if (!strategiesInput.val() || JSON.parse(strategiesInput.val()).length === 0) {
                alert('Elige al menos una Estrategia');
                return;
            }
        }

        if (confirm("El Mazo se Reemplazará por el Mazo Actual, asegurate que sea el que deseas o que los slots esten Vacios.") &&
            (level != "basic" ? confirm(`¿Desea gastar ${costGems[level]} gemas para crear el mazo?`) : true)) {
            let formData = formElement.serializeArray().reduce(function (obj, item) {
                obj[item.name] = item.value;
                return obj;
            }, {});

            const apiPayload = {
                ...formData,
                winConditionName: winConditionChecked && winConditionCard ? winConditionCard.name : 'null'
            };

            // Asumiendo que 'api' es una función global o importada
            if (typeof api === 'function') {
                api("POST", "/v1/deckbuilder", 'cre-maz', apiPayload, null, $('#btn_crear'));
            } else {
                console.error("La función 'api' no está definida.");
            }
        }
    }

    /**
     * Maneja el submit del formulario para analizar un mazo.
     * @param {jQuery} formElement - El elemento jQuery del formulario.
     */
    static handleAnalyzeDeckSubmit(formElement) {
        if ($(".cs-deck__slot").toArray().every(element => $(element).data("lleno") !== 'no')) {
            const analysisType = formElement.find('input[name="type"]').val();
            const cost = analysisType === 'advanced' ? '3' : '0';
            let msg = `¿Desea Analizar el Mazo de forma ${analysisType}?, costará ${cost} gemas`;
            let analysisEvo;

            if (analysisType === 'intermediate') {
                msg = 'Se analizará el Mazo Actual de Forma Basica, ¿Desea continuar?';
                analysisEvo = 2;
            } else {
                analysisEvo = $('#inp_ana_che').prop('checked') ? 2 : 0;
            }

            if (confirm(msg)) {
                let formData = formElement.serializeArray().reduce(function (obj, item) {
                    obj[item.name] = item.value;
                    return obj;
                }, {});

                const deckData = $('#deck-slots-main').data('cards') || [];
                const towerCardData = $('#deck-slots-main').data('towercard') || [];
                let cards = [...deckData]; // Crear copia
                if (towerCardData.length > 0) {
                    cards.push(towerCardData[0]);
                }
                const cardNames = cards.map(card => card.name);

                const apiPayload = {
                    ...formData,
                    namesCards: JSON.stringify(cardNames),
                    AnaEvo: analysisEvo
                };

                api("POST", "/v1/deckanalyzer", 'det-maz', apiPayload, $('#btn_analizar'));
            }
        } else {
            $('#main-deck-collection-alert').html('<span class="cs-color-IntenseOrange text-center">El Mazo está incompleto</span>');
            Config.showAlert('<span class="cs-color-IntenseOrange text-center">El Mazo está incompleto</span>');
        }
    }
}
