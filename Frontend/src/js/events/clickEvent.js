export default function initEventClick() {

    $(document).on('click', 'button', function () {
        User.userInteracted && $('#audio_button')[0].play();
    });

    $(document).on('click', 'button:not([type="submit"]), .img_emote_enviar, #div_sections_content, #capa_contenido, .div_res_men, .span-pag, .card--is-interactive, #btn_menu_perfil, .a_nom_pub, .a_nom_men, #span_acercade, #span_noti, .img_cam_banner, .pub_img, #btn_x_img_full, .cs-tooltip-image, .cs-deck-collection__box-btns-option, .avatar, #div_get_sb, .div_apply_est, .cs-deck__slot', function (e) {
        // Evitar que el click normal interfiera con el toque largo o doble clic en las cartas del mazo
        if ($(this).closest('.card--is-interactive').parent().hasClass('cs-deck__slot') && Card.isLongPress) {
            // Si fue long press, no hacer nada más en el click normal
            return;
        }

        console.log(
            "%cClick/Tap Event Triggered!",
            "color: blue; font-weight: bold;",
            "\nElement Class:", $(this).attr("class"),
            "\nElement ID:", $(this).attr("id"),
            "\nTarget:", e.target
        );

        // --- Inicio: Lógica para Mover Cartas (Click en Slot Destino - Móvil) ---
        if ($(this).hasClass('cs-deck__slot') && Card.selectedCardToMove) {
            // Si hay una carta seleccionada y se hace clic en un slot (destino en móvil)
            Card.moveOrSwapCard($(this));
            return; // Detener otras lógicas de click en slots
        }
        // --- Fin: Lógica para Mover Cartas ---

        //con clases
        if ($(this).attr('class') != undefined) {
            let classes = $(this).attr('class').split(' ')
            for (let i = 0; i < classes.length; i++) {
                switch (classes[i]) {
                    case 'btn_x_perfil': // Cerrar div toggle
                        Config.handleCloseToggleClick($(this));
                        break;
                    case 'span-pag': //llamada a mostrar imagenes
                        let pagina = $(this).data('pagina');
                        let inicio = (pagina - 1) * 1;
                        api({ db: $(this).data('database'), idpub: $(this).data('idpub'), inicio: inicio, fin: (inicio + 1), pagination: true }, 'cam-pag', $(this), $(this).parents('#pagination-container').siblings('#gallery-container'));
                        $(this).parents('.pagination-container').find('.span-pag').removeClass('active');
                        $(this).addClass('active');
                        break;
                    case 'btn_comentarios': //click para mostrar/ocultar comentarios
                        $(this).siblings('.div_coment').slideToggle(500);
                        $(this).data('getcom') == 'no' && api({ returnComent: true, id_Pub: $(this).data('idpub') }, 'get-com', $(this).siblings('.div_coment').children('.caja-coment'), $(this));
                        break;
                    case 'card--is-interactive': // Mostrar opciones de una carta
                        Card.handleClick($(this));
                        break;
                    case 'cs-card__info': // Ver información de una carta
                        Card.handleInfoButtonClick($(this));
                        break;
                    case 'cs-card__use-remove': // Insertar o eliminar una carta del mazo
                        Card.handleAddRemoveButtonClick($(this));
                        break;
                    /*                     case 'a_nom_pub': //mostrar inf de usuario en publicaciones
                                        case 'a_nom_men': //mostrar inf de usuario en mensajes
                                            $('#capa_contenido').fadeIn(250);
                                            $('#div_perfilusu').fadeIn(250).append('<div class="div_loading_toggle"></div>');
                                            api({ nomusu: $(this).data('name'), type: 'pub', perfil: true }, 'ver-per', null, $('#div_perfilusu').children('.div_loading_toggle'));
                                            $('.div_toggle').on('scroll', function () {
                                                lazyloading();
                                            });
                                            break; */
                    case 'img_cam_banner': // Seleccionar banner
                        User.handleSelectBannerClick($(this));
                        break;
                    case 'pub_img':
                    case 'avatar':
                        $('#div_fullimg').fadeToggle(250);
                        $('#img_fullscreen').attr('src', $(this).attr('src'));
                        break;
                    case 'btn_purchase': //muestra btn de opciones de pagos
                        alert('¡Lo sentimos! Las compras de gemas aún no está disponible, Pronto podrás adquirirlas. ¡Mantente al tanto!');
                        break;
                    /*                         if (Cookie.getCookie('TypeAcount') == 'invitado') {
                                                alert('¡Aún eres invitado!, Regístrate y únete a la fiesta de verdad.');
                                                break;
                                            }
                                            let btnThis = $(this);
                                            const precio = $(this).data('precio');
                                            const valGems = $(this).data('valor');
                                            $('#span_precio_gems').text(valGems);
                                            $('#span_precio_get_gems').text(precio);
                                            $('#div_pay_get_gems').slideDown(500);
                    
                                            // paypal
                                            $('#paypal-button-container').empty();
                    
                                            paypal.Buttons({
                                                env: 'production', // sandbox | production
                                                createOrder: function (data, actions) { // createOrder() is called when the button is clicked
                                                    return actions.order.create({
                                                        purchase_units: [{
                                                            amount: {
                                                                value: precio,
                                                                currency_code: 'USD'
                                                            }
                                                        }]
                                                    });
                                                },
                                                onApprove: function (data, actions) { // onApprove() is called when the buyer approves the payment
                                                    api({ approveOrder: true, type: precio, orderID: data.orderID, payerID: data.payerID }, 'apr-ord', null, btnThis);
                                                }
                                            }).render('#paypal-button-container');
                    
                                            // google pay 
                                            $('#google-pay-button-container').empty();
                     */
                    case 'cs-deck-collection__box-btns-option': // Cambiar de mazo
                        Deck.update($(this));
                        break;
                    case 'btn_opc_cre_maz': // Opciones de mazos creados
                        Deck.handleCreatedDeckOptionClick($(this));
                        break;
                    /* case 'reply-btn': // Click en responder mensaje
                        Chat.handleReplyButtonClick($(this));
                        break; */
                    case 'btn_sel_est_show': //seleccionar la estrategia
                        if ($(this).parent('.div_apply_est').data('state') == 'active') {
                            let div_apply_est = $(this).parent('.div_apply_est');
                            let idest = div_apply_est.data('idest');
                            let type = $('#type_apply').data('type');
                            let divEstrategias = $('#frm_crear_mazo_1_1');
                            type == 'analizar' && (divEstrategias = $('#frm_ana_maz_ava_v1_1'));

                            if (div_apply_est.hasClass('apply_est')) { // Verifica si el div tiene la clase "apply_est"
                                $(this).text('Seleccionar').css({ background: 'var(--cs-color-GoldenYellow)' });
                                div_apply_est.removeClass('apply_est'); // Si la tiene, la elimina
                                divEstrategias.find('.div_estrategias_seleccionadas p[data-id="' + div_apply_est.data('idest') + '"]').remove(); // Elimina el p con el ID correspondiente
                                const estrategias = divEstrategias.find('input[name="idsEstrategias"]').val() ? JSON.parse(divEstrategias.find('input[name="idsEstrategias"]').val()) : [];
                                const index = estrategias.indexOf(idest);
                                index >= 0 && estrategias.splice(index, 1);
                                divEstrategias.find('input[name="idsEstrategias"]').val(JSON.stringify(estrategias)); //agrega los ids actualizados
                            } else { //aplica la la estrategia al forma para ser enviado
                                if ((JSON.parse(divEstrategias.find('input[name="idsEstrategias"').val()).length + 1) > 3) {
                                    alert('Limite de Estrategias superado, No puedes seleccionar mas de 3 Estrategias');
                                    break;
                                }
                                $(this).text('Deseleccionar').css({ background: 'var(--cs-color-IntenseOrange)' });
                                div_apply_est.addClass('apply_est');
                                divEstrategias.find('.div_estrategias_seleccionadas').append('<p class="p_est_show cs-color-GoldenYellow" data-id="' + idest + '">' + div_apply_est.data('nombre') + '</p>');
                                divEstrategias.find('input[name="idsEstrategias"').val(function (index, val) {
                                    let arr = val ? JSON.parse(val) : [];
                                    arr.push(idest);
                                    return JSON.stringify(arr);
                                });
                            }
                        }
                        break;
                    case 'btn_eleccion_est': //muestra las estrategias para su eleccion
                        showDivToggle('showToggle');
                        api({ getStrategies: 'html', type: $(this).data('type') }, 'get-est', { type: $(this).data('type'), idsEst: $(this).siblings('input[name="idsEstrategias"]').val() }, $('#div_tog_gen_con'));
                        break;
                    case 'btn_crear_est': // Mostrar div para crear Estrategias
                        Strategy.handleCreateStrategyClick();
                        break;
                    case 'btn_edit_est': // Editar la estrategia
                        Deck.handleEditStrategyClick($(this));
                        break;
                    case 'cs-deck__slot': // Click en un slot de carta
                        if (Card.selectedCardToMove) {
                            // Si hay una carta seleccionada para mover, este es el slot destino
                            Card.handleMoveTargetSlotClick($(this));
                        } else {
                            // Si no hay carta seleccionada y el slot está vacío, hacer scroll
                            Card.handleEmptySlotClick($(this));
                        }
                        break;
                }
            }
        }

        //con id
        switch ($(this).attr('id')) {
            case 'div_sections_content'://desactiva las interacciones con los mensajes y de otros toggles activos
            case 'capa_contenido': // También se usa para cancelar selección de movimiento
                // Oculta respuestas y opciones si el clic no está en elementos específicos
                if (!$(e.target).is('.div_res, .reply-btn, .reply-text, .img_chat_res')) {
                    $('.MsgChat').removeClass('div_tap_res').find('.div_res').fadeOut(250);
                    $('#frm_chat').fadeIn(250);
                    /* Chat.chat_var.MsgChat?.find('.reply-btn').fadeIn(250);
                    Chat.chat_var.MsgChat?.find("#div_res_men_inp").fadeOut(250); */
                }

                // Oculta menús y elementos si el clic no está en sus áreas
                !$(e.target).closest('#div_opciones, #btn_btns_opc_maz, .cs-tooltip-image, #btn_Orden_cards_advanced, #div_options_advanced_order').length &&
                    $('#menu_opciones, #div_sub_btns_mazo, #cs-tooltip-box, #div_options_advanced_order').fadeOut(250);

                // Oculta las opciones de la card si el clic no es en una carta
                !e.target.closest('.cs-card') && $('.card--show-opt').removeClass('card--show-opt').find('.cs-card__options').slideUp(100);

                // Cancela la selección de mover carta si se hace clic fuera de un slot o carta del mazo
                if (Card.selectedCardToMove && !$(e.target).closest('.cs-deck__slot').length) {
                    Card.cancelCardMoveSelection();
                }
                break;
            /*             case 'btn_bajar_chat'://bajar caja chat
                            scrollToEnd($('#nuevomensaje'));
                            break; */
            /* case 'btn_emote_enviar': // Mostrar selector de emotes
                Chat.handleOpenEmoteSelectorClick();
                break; */
            /*             case 'btn_encuesta': //toggle encuesta
                            $('#div_encuesta').slideToggle(500, () => { setMinMaxEnc() });
                            break; */
            case 'btn_publicacion': //toggle publicacion
                $('#div_publiquero').slideToggle(500);
                break;
            /* case 'img_emote_enviar-' + $(this).data('emote'): // Seleccionar emote
                Chat.handleSelectEmoteClick($(this));
                break; */
            case 'btn_infjug': // Mostrar/Ocultar info del jugador (API)
                User.handleTogglePlayerInfoClick($(this));
                break;
            /* case 'div_res_men-' + $(this).data('idrescha'): // Scroll al mensaje respondido
                Chat.handleScrollToRepliedMessageClick($(this));
                break; */
            case 'btn_idiomas': //Idiomas
                $('#div_content_idiomas').fadeToggle(250);
                break;
            case 'btn_menu_opc': //click al menu
                $('#menu_opciones').fadeToggle(250);
                break;
            case 'btn_eli_maz': // Eliminar mazo
                Deck.handleDeleteDeckClick();
                break;
            case 'btn_ocu_mos_res_ST': // Ocultar/Mostrar detalles del análisis del mazo
                Deck.handleToggleAnalysisResultsClick($(this));
                break;
            case 'btn_analizar': // Mostrar botones para analizar mazos
                Deck.handleAnalyzeButtonClick();
                break;
            case 'btn_analizar_mazo_basico': // Analizar mazo de forma básica
                Deck.handleBasicAnalysisButtonClick();
                break;
            case 'btn_analizar_mazo_avanzado': // Analizar mazo de forma avanzada
                Deck.handleAdvancedAnalysisButtonClick();
                break;
            /*             case 'btn_menu_perfil': //ver perfil personal
                            $('#capa_contenido').fadeIn(250);
                            $('#div_perfilusu').fadeIn(250).append('<div class="div_loading_toggle"></div>');
                            api({ nomusu: 'session', type: 'per', perfil: true }, 'ver-per', null, $('#div_perfilusu').children('.div_loading_toggle'));
                            $('.div_toggle').on('scroll', function () {
                                lazyloading();
                            });
                            break; */
            case 'span_noti': // Ver notificaciones
                User.handleShowNotificationsClick();
                break;
            case 'span_acercade': //ver acercade
                showDivToggle('showToggle');
                api({ acercaDe: true }, 'get-inf', null, $('#div_tog_gen_con'));
                break;
            case 'btn_settings': // Mostrar configuración
                User.handleShowSettingsClick();
                break;
            case 'btn_reglas': //ver reglas de chat
                $('#capa_contenido').fadeIn(250);
                $('#div_reglas').fadeIn(250);
                break;
            case 'btn_peg_maz': // Pegar enlace de mazo
                Deck.handlePasteDeckLinkClick();
                break;
            case 'changeBanner': // Mostrar/Ocultar cambio de banner
                User.handleToggleChangeBannerClick();
                break;
            case 'changePhoto': // Mostrar/Ocultar cambio de avatar
                User.handleToggleChangeAvatarClick();
                break;
            case 'btn_cop_maz': // Copiar mazo a Clash Royale
                Deck.handleCopyDeckToGameClick();
                break;
            case 'btn_x_img_full':
                $('#div_fullimg').fadeToggle(250);
                break;
            case 'btn_crear': // Mostrar botones para crear mazo
                Deck.handleCreateButtonClick();
                break;
            case 'btn_mod':
                $('#capa_contenido').fadeOut(250);
                $('#div_modal').fadeOut(250);
                Cookie.setCookie('bienvenida', true);
                break;
            case 'btn_cam_mazos': // Cambiar vista de mazos (1-5 / 6-10)
                Deck.handleChangeDeckViewClick();
                break;
            case 'btn_car_wiki': // Mostrar/Ocultar wiki de carta
                Deck.handleToggleWikiClick($(this));
                break;
            case 'btn_can_ana_maz_ava': // Cancelar análisis v1.0
            case 'btn_cancelar_analisis_v1_1': // Cancelar análisis v1.1
                Deck.handleCancelAnalysisClick();
                break;
            case 'btn_can_cre_maz_pers': // Cancelar creación v1.0
            case 'btn_concelar_crear_mazo_v1_1': // Cancelar creación v1.1
                Deck.handleCancelCreateClick();
                break;
            case 'btn_mas_moneda': //lleva a shop para comprar mas monedas o gemas
            case 'btn_mas_gema':
                showDivToggle('showToggle');
                api({ getSectionMembers: "shop" }, 'get-sho', null, $('#div_tog_gen_con'));
                /* $('#a_menu_shop').click();
                $(this).attr('id') == 'btn_mas_moneda' ? (menuSection.data.viewElement = 'div_tienda_monedas') : (menuSection.data.viewElement = 'div_tienda_gemas'); */
                break;
            case 'btn_copiar_mazo': // Copiar enlace del mazo
                Deck.handleCopyDeckLinkClick();
                break;
            case 'btn_menu_enc_pub': //click al boton de publicaciones y encuestas
                $('#capa_contenido').fadeIn(250);
                $('#div_enc_pub').fadeToggle(250);
                break;
            case 'btn_ver_log_maz': // Mostrar/Ocultar log del mazo
                Deck.handleToggleDeckLogClick();
                break;
            case 'btn_noty_visto': // Marcar notificación como vista
                User.handleMarkNotificationSeenClick($(this));
                break;
            case 'btn_noty_elim': //eliminar un publicacion
                break;
            case 'btn_cam_card_no': // Cancela el reemplazo de carta
                Card.handleCancelReplaceClick();
                break;
            case 'btn_btns_opc_maz': // Mostrar/Ocultar opciones del mazo
                Deck.handleToggleDeckOptionsClick();
                break;
            case 'btn_ban_act': //ver la version y la inf de nuevas funciones de la actualizacion
                $('#span_acercade').click();
                break;
            case 'btn_Orden_cards': // Cambiar el orden de las cartas
                Card.handleOrderButtonClick();
                break;
            case 'btn_Orden_cards_advanced': // Orden avanzado de cartas
                Card.handleAdvancedOrderButtonClick();
                break;
            case 'div_get_sb': //obener la inf sobre nosotros
                showDivToggle('showToggle');
                api({ sobreNosotros: true }, 'get-sb', null, $('#div_tog_gen_con'));
                break;
            case 'btn_com_clan': //muestra el form para clan
                $('#div_com_clan').slideToggle(500);
                break;
            /* case 'btn_can_re_men_inp': // Cancelar respuesta de mensaje
                Chat.handleCancelReplyClick();
                break; */
            case 'btn_nom_usu': // Mostrar datos básicos del usuario
                User.handleShowUserDataClick();
                break;
        }
    });
}
