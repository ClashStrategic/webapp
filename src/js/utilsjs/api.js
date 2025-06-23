/**
 * API Configuration
 */
const API_CONFIG = {
    baseUrl: () => localStorage.getItem('base_url_api'),
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
            localStorage.setItem("session", JSON.stringify(res.data));
            api("GET", "/v1/users", "get-user");
        },
        'get-user': (res) => {
            localStorage.setItem("user", JSON.stringify(res.data));
            Config.renderTemplate("HomeView", { user: res.data }).then(html => {
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
            if (res.state == 'success') {
                Cookie.deleteAllCookies();
                sessionStorage.clear();
                location.href = './home';
            } else {
                alert("Error al cerrar sesión.");
            }
        },
        'login': (res) => {
            if (Object.keys(res.data).length > 0) {
                location.href = './home';
            } else {
                alert("Error al iniciar sesión.");
            }
        },
        'register': (res) => {
            if (Object.keys(res.data).length > 0) {
                Cookie.setCookie('bienvenida', false);
                location.href = './home?new_user=true';
            } else {
                alert("Error al registrar el usuario.");
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
        'update-deck': (res) => {
            Cookie.setCookie('Mazos', JSON.stringify(res.data.decks));
            sessionStorage.setItem("user", JSON.stringify(res.data));
        },
        'det-maz': (res) => {
            $('#div_res_ST').fadeIn(125);
            Config.renderTemplate("DeckAnalysisView", { result: res.data.result }).then(html => {
                $('#div_res_ana_maz').html(html);
            });
            $('#span_gems').text(res.data.balance.gems);
            if (res.data.message) {
                $('#main-deck-collection-alert').html(res.data.message);
                Config.showAlert(res.data.message);
            }
            $('#div_analizar_mazo').slideUp(0);
            if (res.state === 'success') {
                $('#btn_ocu_mos_res_ST').fadeIn(250);
            }
        },
        'ana-maz': (res) => {
            $('#deck-data-info').html(`
            <div><img class="cs-icon cs-icon--medium" src="./static/media/styles/icons/card_stat_inf/icon_gota_elixir.webp"
                alt="cycle"><span class="color-elixir">${res.data.result.data.averageElixirCost}</span></div>
            <div><img class="cs-icon cs-icon--medium" src="./static/media/styles/icons/icon_cycle.webp"
                alt="shortCycle">&nbsp;<span class="color-elixir">${res.data.result.data.shortCycle}</span></div>`);
            Config.renderTemplate("DeckAnalysisView", { result: res.data.result }).then(html => {
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
                $('#span_gems').text(res.data.balance.gems);
                $('#span_coins').text(res.data.balance.coins);
                $('#div_alert_shop_gems').append(res.data.message);
            } else {
                $('#div_alert_shop_gems').append(res.data.message);
            }
            Config.showAlert(res.data.message);
        },
        'get-products': (res) => {
            Config.renderTemplate("ShopSectionView", { products: res.data }).then(html => {
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
 * @param {string} url - API endpoint URL
 * @param {string} type - API endpoint type
 */
function handleError(error, url, type) {
    console.error(`❌ API Error for ${url} (${type})}:`, error);
    let msgError;
    if (error.responseJSON && error.responseJSON.message) {
        msgError = error.responseJSON.message;
    } else {
        msgError = 'Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.';
    }
    alert(msgError);
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
export default function api(method, url, type, data = {}, options = null, load = null) {
    if (!method || !url || !type) {
        console.error('API: method, url, and type are required');
        return;
    }

    console.log(`🌐 API Call: ${type}`, { method, url, data, options, hasLoadElement: !!load });

    $.ajax({
        type: method,
        url: API_CONFIG.baseUrl() + url,
        data: JSON.stringify(data),
        dataType: API_CONFIG.dataType || 'json',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
            handleBeforeSend(type, load);
        },
        success: function (res) {
            handleSuccess(res, type, data, options);
        },
        error: function (error) {
            handleError(error, url, type);
        },
        complete: function () {
            handleComplete(load);
        }
    });
}

