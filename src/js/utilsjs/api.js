/**
 * API Configuration
 */
const API_CONFIG = {
    method: "POST",
    baseUrl: () => localStorage.getItem('base_url_api') + "/App/Config/Routes.php",
    dataType: "json",
    loadingGif: "./static/media/styles/icons/menu/logo_cargando.gif"
};

/**
 * BeforeSend handlers for specific API types
 */
const BEFORE_SEND_HANDLERS = {
    'cam-pag': () => {
        $('.img_loading').css({ height: '25%' });
    }
};

/**
 * Response handlers organized by category
 */
const RESPONSE_HANDLERS = {
    // UI and Content Management
    ui: {
        'cam-pag': (res, data, options) => {
            const img = options.parents('.pagination-container').siblings('.gallery-container').find('.fg_img_pub');
            img.html(`<img data-idpub="${data.idpub}" class="pub_img" src="./static/media/styles/user/publicaciones/imagenes/${res.archivo}" alt="img_pub">`).fadeOut(0).fadeIn(250);
        }
    },

    // User and Profile Management
    user: {
        'get-session': (res) => {
            $.each(res.data, function (index, value) {
                sessionStorage.setItem(index, JSON.stringify(value));
            });

            Config.renderTemplate("HomeView", res.data).then(html => {
                $(document.body).html(html);
                User.toggleSounds(Cookie.getCookie("sound_effects"));
                Cookie.setCookiesForSession();

                // Bienvenida a un nuevo usuario
                Config.urlParam.get("new_user") &&
                    Cookie.getCookie("bienvenida") === "false" &&
                    Config.showInfBox(
                        "¡Bienvenido a Clash Strategic!",
                        "reyes_bienvenida.webp",
                        Config.msgInit,
                        60
                    );

                // Bienvenida a los usuarios invitados
                Cookie.getCookie("TypeAcount") == "invitado" &&
                    (showDivToggle('showToggle'), Config.renderTemplate('PresentationCsView').then(html => {
                        showDivToggle('loadContent', 'Bienvenido', html);
                    }));

                // Activa seccion de cartas
                $("#a_menu_cartas").click();
            });
        },
        'ver-per': (res) => {
            $('#div_perfilusu').html(res.data.html);
            if (Cookie.getCookie('TypeAcount') !== 'invitado') {
                api({ publicaciones: true, idpubusu: res.data.idpubusu, typePub: 'pubUsu' }, 'pub-usu');
            }
        },
        'ses-js': (res) => {
            Cookie.setCookie('id', res.data.id);
            Cookie.setCookie('dateBanHideAct', res.data.dateBanHideAct);
        },
        'cer-ses': (res) => {
            Cookie.deleteAllCookies();
            sessionStorage.clear();
            res.data.cer_ses ? (location.href = './home') : alert(res.data.res);
        },
        'ini-gog': (res) => {
            if (res.data.acount) {
                res.data.new_user ?
                    (Cookie.setCookie('bienvenida', false), location.href = './home?new_user=true') :
                    (location.href = './home');
            } else {
                alert(res.data.res);
            }
        }
    },

    // Game and Deck Management
    game: {
        'api-cla': (res) => {
            $('#div_infjug').html(res.data.html);
            api({ es: true }, 'tra-es');
        },
        'cre-maz': (res) => {
            Deck.setCreatedDecks(res);
        },
        'sho-car': (res) => {
            Deck.eliminarGifCargando();
            Card.setCards(res);
        },
        'gua-maz': (res) => {
            res.data.state == 'success' && (Cookie.setCookie('Mazos', res.data.Mazos), $('#main-deck-collection-alert').html(res.data.res));
        },
        'det-maz': (res) => {
            $('#div_res_ST').fadeIn(125);
            Config.renderTemplate("DeckAnalysisView", res.data.data).then(html => {
                $('#div_res_ana_maz').html(html);
            });
            $('#span_gems').text(res.data.Gems);
            if (res.data.alerts) {
                let resAlerts = Object.values(res.data.alerts).join('<br>');
                const alertMessages = Object.values(res.data.alerts);
                $('#main-deck-collection-alert').html(resAlerts);
                Config.showAlertSequentially(alertMessages);
            }
            $('#div_analizar_mazo').slideUp(0);
            if (res.state === 'success') {
                $('#btn_ocu_mos_res_ST').fadeIn(250);
            }
        },
        'ana-maz': (res) => {
            Config.renderTemplate("DeckAnalysisView", res.data.data).then(html => {
                $('#div_det_basic').html(html);
            });
        }
    },

    // Shop and Economy
    shop: {
        'apr-ord': (res) => {
            if (res.data.error) {
                $('#div_alert_shop_gems').html(res.data.res);
            } else {
                $('#span_gems').text(res.data.Gems);
            }
            Config.showAlert(res.data.res);
        },
        'get-gem': (res) => {
            if (res.data.state == "success") {
                $('#span_gems').text(res.data.data.Gems);
                $('#div_alert_shop_gems').append(res.data.alerts[0]);
            } else {
                $('#div_alert_shop_gems').append(res.data.alerts[0]);
            }
            Config.showAlert(res.data.alerts[0]);
        },
        'get-products': (res) => {
            Config.renderTemplate("ShopSectionView", { products: res.data}).then(html => {
                showDivToggle('loadContent', 'Tienda', html);
            });
        }
    },

    // Content and Information
    content: {
        'get-not': (res) => {
            showDivToggle('loadContent', 'Notificación', res.data.res);
        },
        'pub-usu': (res) => {
            $('#div_pubusu').html(res.data.html);
            $('#div_perfilusu').scrollTop(0);
        }
    },

    // Strategies and Tools
    strategies: {
        'get-est': (res, _data, options) => {
            showDivToggle('loadContent', 'Estrategias', `<span id="type_apply" data-type="${options.type}">Estrategias para ${options.type} Mazos:</span>${res.data.Estrategias}`);
            const estrategiasSeleccionadas = options.idsEst ? JSON.parse(options.idsEst) : [];
            $('.div_apply_est').each((index, value) => {
                const idEst = $(value).data('idest');
                if (estrategiasSeleccionadas.includes(idEst)) {
                    $(value).addClass('apply_est');
                    $(value).find('.btn_sel_est_show').text('Deseleccionar').css({ background: 'var(--cs-color-IntenseOrange)' });
                }
            });
        },
        'tra-es': (res) => {
            $.each(res.data.data, (key, value) => {
                $('p').each((index, element) => {
                    const content = $(element).text();
                    if (content.includes(key)) {
                        const regex = new RegExp(`\\b${key}\\b`, 'g');
                        $(element).html(content.replace(regex, value));
                    }
                });
            });
        }
    },

    // Chat and Communication
    communication: {
        'my-emo': (res) => {
            $('.div_img_emote_enviar').html(res.data.html);
        },
        'scr-men': (res) => {
            $('#nuevomensaje_load_gif').css({ height: '0em' });
            $('#nuevomensaje').prepend(res.data.html);
            Chat.chat_var.offset = res.data.idcar;
            Chat.chat_var.isRequesting = false;
        }
    },

    // System and Maintenance
    system: {
        'ins-vis': () => { /* Empty handler */ },
        'update': () => { /* Empty handler */ }
    }
};

/**
 * Handles the beforeSend phase of AJAX requests
 * @param {string} type - API endpoint type
 * @param {jQuery} load - Loading element
 */
function handleBeforeSend(type, load) {
    // Show loading indicator if load element is provided
    if (load) {
        load.css({ 'position': 'relative' });
        load.append(`<img class="img_loading" src="${API_CONFIG.loadingGif}">`);
    }

    // Execute specific beforeSend handler if exists
    if (BEFORE_SEND_HANDLERS[type]) {
        BEFORE_SEND_HANDLERS[type]();
    }
}

/**
 * Handles successful API responses
 * @param {Object} res - Response object
 * @param {string} type - API endpoint type
 * @param {Object} data - Original request data
 * @param {Object} options - Request options
 */
function handleSuccess(res, type, data, options) {
    // Handle error responses
    if (res.state === 'error') {
        alert(Object.values(res.alerts).join('. <br>'));
        return;
    }

    // Handle info responses
    if (res.state === 'info') {
        alert(Object.values(res.alerts).join('. '));
    }

    // Find and execute the appropriate handler
    const handler = findHandler(type);
    if (handler) {
        try {
            handler(res, data, options);
        } catch (error) {
            console.error(`Error executing handler for type '${type}':`, error);
        }
    } else {
        console.warn(`No handler found for API type: ${type}`);
    }

    // Enhanced response logging
    console.log(`✅ API Response: ${type}`, res);
}

/**
 * Finds the appropriate handler for a given API type
 * @param {string} type - API endpoint type
 * @returns {Function|null} - Handler function or null if not found
 */
function findHandler(type) {
    // Search through all handler categories
    for (const category of Object.values(RESPONSE_HANDLERS)) {
        if (category[type]) {
            return category[type];
        }
    }
    return null;
}

/**
 * Handles API request errors
 * @param {Object} error - Error object
 * @param {string} type - API endpoint type
 */
function handleError(error, type) {
    console.error(`❌ API Error for ${type}:`, error);
    alert('Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.');
}

/**
 * Handles the completion of AJAX requests
 * @param {jQuery} load - Loading element
 */
function handleComplete(load) {
    // Remove loading indicator
    if (load) {
        load.find('.img_loading').remove();
    }
}

/**
 * Main API function with improved structure and error handling
 * @param {Object|string} data - Data to send with the request
 * @param {string} type - API endpoint type
 * @param {Object} options - Additional options for the request
 * @param {jQuery} load - Loading element to show/hide loading indicator
 */
export default function api(url, type, data = {}, options = null, load = null) {
    // Input validation
    if (!url) {
        console.error('API: url parameter is required');
        return;
    }

    if (!type) {
        console.error('API: type parameter is required');
        return;
    }

    // Enhanced logging
    console.log(`🌐 API Call: ${type}`, { data, options, hasLoadElement: !!load });

    $.ajax({
        type: API_CONFIG.method,
        url: url,
        data: data,
        dataType: API_CONFIG.dataType,
        beforeSend: function () {
            handleBeforeSend(type, load);
        },
        success: function (res) {
            handleSuccess(res, type, data, options);
        },
        error: function (error) {
            handleError(error, type);
        },
        complete: function () {
            handleComplete(load);
        }
    });
}