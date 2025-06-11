/**
 * Click handler registry - organized by handler type
 */
const CLICK_HANDLERS = {
    // Handlers by CSS class
    classes: {
        'btn_x_perfil': (element) => Config.handleCloseToggleClick(element),
        'card--is-interactive': (element) => Card.handleClick(element),
        'cs-card__info': (element) => Card.handleInfoButtonClick(element),
        'cs-card__use-remove': (element) => Card.handleAddRemoveButtonClick(element),
        'img_cam_banner': (element) => User.handleSelectBannerClick(element),
        'cs-deck-collection__box-btns-option': (element) => Deck.update(element),
        'btn_opc_cre_maz': (element) => Deck.handleCreatedDeckOptionClick(element),
        'btn_crear_est': () => Strategy.handleCreateStrategyClick(),
        'btn_edit_est': (element) => Deck.handleEditStrategyClick(element),
        'btn_purchase': () => alert('¡Lo sentimos! Las compras de gemas aún no está disponible, Pronto podrás adquirirlas. ¡Mantente al tanto!')
    },

    // Handlers by element ID
    ids: {
        'btn_publicacion': () => $('#div_publiquero').slideToggle(500),
        'btn_infjug': (element) => User.handleTogglePlayerInfoClick(element),
        'btn_idiomas': () => $('#div_content_idiomas').fadeToggle(250),
        'btn_menu_opc': () => $('#menu_opciones').fadeToggle(250),
        'btn_eli_maz': () => Deck.handleDeleteDeckClick(),
        'btn_ocu_mos_res_ST': (element) => Deck.handleToggleAnalysisResultsClick(element),
        'btn_analizar': () => Deck.handleAnalyzeButtonClick(),
        'btn_analizar_mazo_basico': () => Deck.handleBasicAnalysisButtonClick(),
        'btn_analizar_mazo_avanzado': () => Deck.handleAdvancedAnalysisButtonClick(),
        'span_noti': () => User.handleShowNotificationsClick(),
        'btn_settings': () => User.handleShowSettingsClick(),
        'btn_reglas': () => { $('#capa_contenido').fadeIn(250); $('#div_reglas').fadeIn(250); },
        'btn_peg_maz': () => Deck.handlePasteDeckLinkClick(),
        'changeBanner': () => User.handleToggleChangeBannerClick(),
        'changePhoto': () => User.handleToggleChangeAvatarClick(),
        'btn_cop_maz': () => Deck.handleCopyDeckToGameClick(),
        'btn_x_img_full': () => $('#div_fullimg').fadeToggle(250),
        'btn_crear': () => Deck.handleCreateButtonClick(),
        'btn_cam_mazos': () => Deck.handleChangeDeckViewClick(),
        'btn_car_wiki': (element) => Deck.handleToggleWikiClick(element),
        'btn_copiar_mazo': () => Deck.handleCopyDeckLinkClick(),
        'btn_menu_enc_pub': () => { $('#capa_contenido').fadeIn(250); $('#div_enc_pub').fadeToggle(250); },
        'btn_ver_log_maz': () => Deck.handleToggleDeckLogClick(),
        'btn_noty_visto': (element) => User.handleMarkNotificationSeenClick(element),
        'btn_noty_elim': () => { }, // Empty handler as in original
        'btn_cam_card_no': () => Card.handleCancelReplaceClick(),
        'btn_btns_opc_maz': () => Deck.handleToggleDeckOptionsClick(),
        'btn_ban_act': () => $('#span_acercade').click(),
        'btn_Orden_cards': () => Card.handleOrderButtonClick(),
        'btn_Orden_cards_advanced': () => Card.handleAdvancedOrderButtonClick(),
        'btn_com_clan': () => $('#div_com_clan').slideToggle(500),
        'btn_nom_usu': () => User.handleShowUserDataClick()
    },

    // Multi-ID handlers (IDs that share the same logic)
    multiIds: {
        'cancel_analysis': {
            ids: ['btn_can_ana_maz_ava', 'btn_cancelar_analisis_v1_1'],
            handler: () => Deck.handleCancelAnalysisClick()
        },
        'cancel_create': {
            ids: ['btn_can_cre_maz_pers', 'btn_concelar_crear_mazo_v1_1'],
            handler: () => Deck.handleCancelCreateClick()
        },
        'shop_currency': {
            ids: ['btn_mas_moneda', 'btn_mas_gema'],
            handler: () => {
                showDivToggle('showToggle');
                api("/api/v1/products", 'get-products', null, $('#div_tog_gen_con'));
            }
        },
        'image_fullscreen': {
            ids: ['pub_img', 'avatar'],
            handler: (element) => {
                $('#div_fullimg').fadeToggle(250);
                $('#img_fullscreen').attr('src', element.attr('src'));
            }
        }
    }
};

/**
 * Handles special cases that require complex logic
 */
const SPECIAL_HANDLERS = {
    // Complex pagination handler
    'span-pag': (element) => {
        const pagina = element.data('pagina');
        const inicio = (pagina - 1) * 1;
        api({
            db: element.data('database'),
            idpub: element.data('idpub'),
            inicio: inicio,
            fin: (inicio + 1),
            pagination: true
        }, 'cam-pag', element, element.parents('#pagination-container').siblings('#gallery-container'));
        element.parents('.pagination-container').find('.span-pag').removeClass('active');
        element.addClass('active');
    },

    // Comments toggle handler
    'btn_comentarios': (element) => {
        element.siblings('.div_coment').slideToggle(500);
        element.data('getcom') == 'no' && api({
            returnComent: true,
            id_Pub: element.data('idpub')
        }, 'get-com', element.siblings('.div_coment').children('.caja-coment'), element);
    },

    // Strategy selection complex logic
    'btn_sel_est_show': (element) => handleStrategySelection(element),

    // Strategy choice handler
    'btn_eleccion_est': (element) => {
        showDivToggle('showToggle');
        api({
            getStrategies: 'html',
            type: element.data('type')
        }, 'get-est', {
            type: element.data('type'),
            idsEst: element.siblings('input[name="idsEstrategias"]').val()
        }, $('#div_tog_gen_con'));
    },

    // Deck slot click handler
    'cs-deck__slot': (element) => {
        if (Card.selectedCardToMove) {
            Card.handleMoveTargetSlotClick(element);
        } else {
            Card.handleEmptySlotClick(element);
        }
    },

    // Special API handlers
    'span_acercade': () => {
        showDivToggle('showToggle');
        Config.renderTemplate("AboutView").then(html => {
            showDivToggle('loadContent', 'AcercaDe', html);
        });
    },

    'div_get_sb': () => {
        showDivToggle('showToggle');
        Config.renderTemplate("AboutUsView").then(html => {
            showDivToggle('loadContent', 'SobreNosotros', html);
        });
    },

    // Modal close handler
    'btn_mod': () => {
        $('#capa_contenido').fadeOut(250);
        $('#div_modal').fadeOut(250);
        Cookie.setCookie('bienvenida', true);
    }
};

/**
 * Handles the complex strategy selection logic
 * @param {jQuery} element - The button element
 */
function handleStrategySelection(element) {
    if (element.parent('.div_apply_est').data('state') != 'active') return;

    const div_apply_est = element.parent('.div_apply_est');
    const idest = div_apply_est.data('idest');
    const type = $('#type_apply').data('type');
    let divEstrategias = $('#frm_crear_mazo_1_1');

    if (type == 'analizar') {
        divEstrategias = $('#frm_ana_maz_ava_v1_1');
    }

    if (div_apply_est.hasClass('apply_est')) {
        // Deselect strategy
        element.text('Seleccionar').css({ background: 'var(--cs-color-GoldenYellow)' });
        div_apply_est.removeClass('apply_est');
        divEstrategias.find('.div_estrategias_seleccionadas p[data-id="' + idest + '"]').remove();

        const estrategias = divEstrategias.find('input[name="idsEstrategias"]').val() ?
            JSON.parse(divEstrategias.find('input[name="idsEstrategias"]').val()) : [];
        const index = estrategias.indexOf(idest);
        if (index >= 0) estrategias.splice(index, 1);
        divEstrategias.find('input[name="idsEstrategias"]').val(JSON.stringify(estrategias));
    } else {
        // Select strategy
        const currentStrategies = JSON.parse(divEstrategias.find('input[name="idsEstrategias"]').val());
        if ((currentStrategies.length + 1) > 3) {
            alert('Limite de Estrategias superado, No puedes seleccionar mas de 3 Estrategias');
            return;
        }

        element.text('Deseleccionar').css({ background: 'var(--cs-color-IntenseOrange)' });
        div_apply_est.addClass('apply_est');
        divEstrategias.find('.div_estrategias_seleccionadas').append(
            '<p class="p_est_show cs-color-GoldenYellow" data-id="' + idest + '">' +
            div_apply_est.data('nombre') + '</p>'
        );
        divEstrategias.find('input[name="idsEstrategias"]').val(function (_index, val) {
            let arr = val ? JSON.parse(val) : [];
            arr.push(idest);
            return JSON.stringify(arr);
        });
    }
}

export default function initEventClick() {
    // Button sound effect
    $(document).on('click', 'button', function () {
        User.userInteracted && $('#audio_button')[0].play();
    });

    // Main click event handler
    $(document).on('click', 'button:not([type="submit"]), .img_emote_enviar, #div_sections_content, #capa_contenido, #div_tog_gen, .div_res_men, .span-pag, .card--is-interactive, #btn_menu_perfil, .a_nom_pub, .a_nom_men, #span_acercade, #span_noti, .img_cam_banner, .pub_img, #btn_x_img_full, .cs-tooltip-image, .cs-deck-collection__box-btns-option, .avatar, #div_get_sb, .div_apply_est, .cs-deck__slot', function (e) {
        // Prevent interference with long press on deck cards
        if ($(this).closest('.card--is-interactive').parent().hasClass('cs-deck__slot') && Card.isLongPress) {
            return;
        }

        console.log(`%cClick Event:`, `color: blue; font-weight: bold;`, `Class: ${$(this).attr("class")}`, `ID: ${$(this).attr("id")}`);

        // Handle card movement logic first
        if ($(this).hasClass('cs-deck__slot') && Card.selectedCardToMove) {
            Card.moveOrSwapCard($(this));
            return;
        }

        // Handle click events using the registry system
        const wasHandled = handleClickEvent($(this), e);

        if (!wasHandled) {
            console.warn(`No handler found for element with ID '${$(this).attr('id')}' and classes '${$(this).attr('class') || 'none'}'`);
        }
    });
}

/**
 * Handles click events using the registry system
 * @param {jQuery} element - The clicked element
 * @param {Event} e - The click event
 * @returns {boolean} - True if a handler was found and executed
 */
function handleClickEvent(element, e) {
    const elementId = element.attr('id');
    const elementClasses = element.attr('class')?.split(' ') || [];

    // Handle special overlay/background clicks first
    if (handleOverlayClicks(element, e, elementId)) {
        return true;
    }

    // Check special handlers first (complex logic cases)
    for (const className of elementClasses) {
        if (SPECIAL_HANDLERS[className]) {
            SPECIAL_HANDLERS[className](element);
            return true;
        }
    }

    if (elementId && SPECIAL_HANDLERS[elementId]) {
        SPECIAL_HANDLERS[elementId](element);
        return true;
    }

    // Check multi-ID handlers
    for (const config of Object.values(CLICK_HANDLERS.multiIds)) {
        if (config.ids.includes(elementId) || config.ids.some(id => elementClasses.includes(id))) {
            config.handler(element);
            return true;
        }
    }

    // Check regular ID handlers
    if (elementId && CLICK_HANDLERS.ids[elementId]) {
        CLICK_HANDLERS.ids[elementId](element);
        return true;
    }

    // Check class handlers
    for (const className of elementClasses) {
        if (CLICK_HANDLERS.classes[className]) {
            CLICK_HANDLERS.classes[className](element);
            return true;
        }
    }

    return false;
}

/**
 * Handles special overlay/background click logic
 * @param {jQuery} _element - The clicked element (unused)
 * @param {Event} e - The click event
 * @param {string} elementId - The element ID
 * @returns {boolean} - True if handled
 */
function handleOverlayClicks(_element, e, elementId) {
    const overlayIds = ['div_sections_content', 'capa_contenido', 'div_tog_gen'];

    if (!overlayIds.includes(elementId)) {
        return false;
    }

    // Hide replies and options if click is not on specific elements
    if (!$(e.target).is('.div_res, .reply-btn, .reply-text, .img_chat_res')) {
        $('.MsgChat').removeClass('div_tap_res').find('.div_res').fadeOut(250);
        $('#frm_chat').fadeIn(250);
    }

    // Hide menus and elements if click is not in their areas
    if (!$(e.target).closest('#div_opciones, #btn_btns_opc_maz, .cs-tooltip-image, #btn_Orden_cards_advanced, #div_options_advanced_order').length) {
        $('#menu_opciones, #div_sub_btns_mazo, #cs-tooltip-box, #div_options_advanced_order').fadeOut(250);
    }

    // Hide card options if click is not on a card
    if (!e.target.closest('.cs-card')) {
        $('.card--show-opt').removeClass('card--show-opt').find('.cs-card__options').slideUp(100);
    }

    // Cancel card move selection if click is outside slot or deck card
    if (Card.selectedCardToMove && !$(e.target).closest('.cs-deck__slot').length) {
        Card.cancelCardMoveSelection();
    }

    return true;
}
