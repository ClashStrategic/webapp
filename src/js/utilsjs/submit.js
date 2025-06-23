/**
 * Submit Configuration - defines different request types and their settings
 */
const SUBMIT_CONFIG = {
    // File upload requests (publications, avatars)
    fileUpload: {
        types: ['ins-pub', 'ins-ava'],
        url: () => localStorage.getItem('base_url_api') + '/App/Config/Routes.phpp',
        processData: false,
        contentType: false,
        method: 'POST',
        dataType: 'json'
    },

    // Standard form requests
    standard: {
        url: localStorage.getItem('base_url_api') + '/App/Config/Routes.php',
        processData: true,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        method: 'POST',
        dataType: 'json'
    },

    // Common settings
    common: {
        loadingGif: './static/media/styles/icons/menu/logo_cargando.gif'
    }
};

/**
 * BeforeSend handlers for specific submit types
 */
const BEFORE_SEND_HANDLERS = {
    'ins-rea': (load) => {
        if (load) load.find('.img_loading').css({ height: '50%' });
    }
};

/**
 * Success handlers organized by category
 */
const SUCCESS_HANDLERS = {
    // Content and Media Management
    content: {
        'ins-pub': (res, _data, frmSubmit, _load) => {
            if (res.data.success) {
                frmSubmit[0].reset();
                frmSubmit.find('#div_show_img_pub').hide();
                $('#alertp1').html(res.data.res);
                setTimeout(() => $('#alertp1').html(''), 4000);
            } else {
                $('#alertp1').html(res.data.res);
            }
        },

        'ins-ava': (res, _data, _frmSubmit, _load) => {
            if (res.data.success) {
                $('.avatar_perfil, .img_banner_perfil').attr('src', './static/media/styles/user/avatars/' + res.data.avatar);
            }
            $('#res-ava').html(res.data.res);
        },

        'cam-ban': (res, _data, _frmSubmit, _load) => {
            $('#img_banner_per_usu').attr('src', './static/media/styles/user/banners/' + res.data.Banner);
            $('#div_alert_cam_ban').html(res.data.res);
        }
    },

    // User Authentication and Registration
    auth: {
        'ins-reg': (res, _data, _frmSubmit, load) => {
            if (res.data.login) {
                $('#frm_registro input').val('');
                localStorage.setItem('bienvenida', "false");
                location.href = './home?new_user=true';
            } else {
                $('#alert_reg').html(res.data.res);
                if (load) load.find('.img_loading').remove();
            }
        },

        'log-usu': (res, _data, _frmSubmit, load) => {
            if (res.data.login) {
                $('#loginform input').val('');
                $('#alert_log').html(res.data.res);
                location.href = './home';
            } else {
                $('#alert_log').html(res.data.res);
                if (load) load.find('.img_loading').remove();
            }
        },

        'set-tag': (res, _data, _frmSubmit, _load) => {
            $('#frm_complete_tag')[0].reset();
            $('#div_alert_frm_compreg').html(res.data.alerts[0] ?? '');
            if (res.success) {
                $('.div_frm_compdat').fadeOut(250);
            }
        }
    },

    // Commerce and Economy
    commerce: {
        'get-coi': (res, _data, frmSubmit, _load) => {
            Config.showAlert(res.data.res);
            $('#span_coins').text(res.data.Coins);
            $('#span_gems').text(res.data.Gems);
            if (res.data.purchase && !res.data.getCoins) {
                frmSubmit.find('.btn_purchase').html('<span style="font-size: var(--text-font-size-p3)">¡Reclamado!</span>');
            }
        },

        'get-emo': (res, _data, frmSubmit, _load) => {
            Config.showAlert(res.data.res);
            $('#span_coins').text(res.data.Coins);
            $('#span_gems').text(res.data.Gems);
            if (res.data.purchase) {
                frmSubmit.find('.btn_purchase').html('<span style="font-size: var(--text-font-size-p2)" class="text">¡Comprado!</span>');
            }
        }
    },

    // Interactive Content
    interactive: {
        'env-enc': (res, _data, _frmSubmit, _load) => {
            if (res.data.success) {
                $('#frm_enc')[0].reset();
                $('#span_alert_enc').html(res.data.res);
                setTimeout(() => $('#span_alert_enc').html(''), 4000);
            } else {
                $('#span_alert_enc').html(res.data.res);
            }
            $('[name="submit_frmencuesa"]').prop("disabled", false);
        },

        'opc-enc': (res, data, frmSubmit, _load) => {
            if (res.data.error) {
                alert(res.data.res);
                return;
            }

            handlePollVoting(res, data, frmSubmit);
        },

        'ins-rea': (res, _data, frmSubmit, _load) => {
            const reactions = [res.data.Reaccion1, res.data.Reaccion2, res.data.Reaccion3, res.data.Reaccion4];
            frmSubmit.parents('.div_int').find('span').each((index, element) => {
                $(element).text(reactions[index]);
            });

            handleReactionUpdate(res, frmSubmit);
            $(".btn_reac1, .btn_reac2, .btn_reac3, .btn_reac4").prop("disabled", false);
        }
    },

    // System and Tools
    system: {
        'ins-inf': (res, _data, _frmSubmit, _load) => {
            $('#div_infusu p').html(res.data.inf);
        },

        'set-est': (res, _data, _frmSubmit, _load) => {
            if (res.data.editEst || res.data.id_Str) {
                handleStrategyUpdate(res);
            } else {
                $('#frm_crear_estrategia').find('.p_alert_form_crear_estrategia').html(res.data.res);
            }
        }
    }
};

/**
 * Determines the appropriate request configuration based on the submit type
 * @param {string} typeSuccess - The submit type
 * @returns {Object} - Request configuration object
 */
function getRequestConfig(typeSuccess) {
    const isFileUpload = SUBMIT_CONFIG.fileUpload.types.includes(typeSuccess);

    if (isFileUpload) {
        return {
            method: SUBMIT_CONFIG.fileUpload.method,
            url: SUBMIT_CONFIG.fileUpload.url(),
            dataType: SUBMIT_CONFIG.fileUpload.dataType,
            processData: SUBMIT_CONFIG.fileUpload.processData,
            contentType: SUBMIT_CONFIG.fileUpload.contentType,
            isFileUpload: true
        };
    } else {
        return {
            method: SUBMIT_CONFIG.standard.method,
            url: SUBMIT_CONFIG.standard.url,
            dataType: SUBMIT_CONFIG.standard.dataType,
            processData: SUBMIT_CONFIG.standard.processData,
            contentType: SUBMIT_CONFIG.standard.contentType,
            isFileUpload: false
        };
    }
}

/**
 * Handles the beforeSend phase of submit requests
 * @param {string} typeSuccess - Submit type
 * @param {jQuery} frmSubmit - Form element
 * @param {jQuery} load - Loading element
 * @param {Object} config - Request configuration
 */
function handleBeforeSend(typeSuccess, frmSubmit, load, config) {
    // Disable submit button for standard requests
    if (!config.isFileUpload && frmSubmit) {
        frmSubmit.find('[type=submit]').prop("disabled", true);
    }

    // Show loading indicator
    if (load) {
        load.css({ 'position': 'relative' });
        load.append(`<img class="img_loading" src="${SUBMIT_CONFIG.common.loadingGif}">`);
    }

    // Execute specific beforeSend handler if exists
    if (BEFORE_SEND_HANDLERS[typeSuccess]) {
        BEFORE_SEND_HANDLERS[typeSuccess](load);
    }
}

/**
 * Handles successful submit responses
 * @param {Object} res - Response object
 * @param {string} typeSuccess - Submit type
 * @param {Object} data - Original request data
 * @param {jQuery} frmSubmit - Form element
 * @param {jQuery} load - Loading element
 * @param {Object} config - Request configuration
 */
function handleSuccess(res, typeSuccess, data, frmSubmit, load, config) {
    // Handle error responses
    if (res.state === 'error') {
        const separator = config.isFileUpload ? '. ' : '. <br>';
        alert(Object.values(res.alerts).join(separator));
        return;
    }

    // Remove loading indicator for file uploads
    if (config.isFileUpload && load) {
        load.find('.img_loading').remove();
    }

    // Update form alert for standard requests
    if (!config.isFileUpload && frmSubmit) {
        frmSubmit.children('.alert_frm').html(res.data.res);
    }

    // Find and execute the appropriate handler
    const handler = findSuccessHandler(typeSuccess);
    if (handler) {
        try {
            handler(res, data, frmSubmit, load);
        } catch (error) {
            console.error(`Error executing handler for type '${typeSuccess}':`, error);
        }
    } else {
        console.warn(`No handler found for submit type: ${typeSuccess}`);
    }

    // Enhanced response logging
    console.log(`✅ Submit Response: ${typeSuccess}`, res);
}

/**
 * Finds the appropriate success handler for a given submit type
 * @param {string} typeSuccess - Submit type
 * @returns {Function|null} - Handler function or null if not found
 */
function findSuccessHandler(typeSuccess) {
    // Search through all handler categories
    for (const category of Object.values(SUCCESS_HANDLERS)) {
        if (category[typeSuccess]) {
            return category[typeSuccess];
        }
    }
    return null;
}

/**
 * Handles submit request errors
 * @param {Object} error - Error object
 * @param {string} typeSuccess - Submit type
 */
function handleError(error, typeSuccess) {
    console.error(`❌ Submit Error for ${typeSuccess}:`, error);
    const message = typeSuccess === 'ins-pub' || typeSuccess === 'ins-ava' ?
        'ha ocurrido un error, intentelo mas tarde' :
        'Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.';
    alert(message);
}

/**
 * Handles the completion of submit requests
 * @param {string} typeSuccess - Submit type
 * @param {jQuery} frmSubmit - Form element
 * @param {jQuery} load - Loading element
 * @param {Object} config - Request configuration
 */
function handleComplete(typeSuccess, frmSubmit, load, config) {
    // Special handling for file uploads
    if (config.isFileUpload) {
        if (typeSuccess === 'ins-pub') {
            $("#publicar").prop("disabled", false);
        }
        return;
    }

    // Remove loading indicator for non-auth requests
    if (typeSuccess !== 'ins-reg' && typeSuccess !== 'log-usu' && load) {
        load.find('.img_loading').remove();
    }

    // Re-enable submit button
    if (frmSubmit) {
        frmSubmit.find('[type=submit]').prop("disabled", false);
    }
}

/**
 * Handles complex poll voting logic
 * @param {Object} res - Response object
 * @param {Object} data - Request data
 * @param {jQuery} frmSubmit - Form element
 */
function handlePollVoting(res, data, frmSubmit) {
    const btn_opc = frmSubmit.parents('.caja_pub').find('.btn_opc');
    const this_btn_opc = frmSubmit.find('button');
    const total = res.data.Votos1 + res.data.Votos2 + res.data.Votos3;
    const percentages = [
        Math.round((res.data.Votos1 / total) * 100),
        Math.round((res.data.Votos2 / total) * 100),
        Math.round((res.data.Votos3 / total) * 100)
    ];

    if (res.data.new) {
        // Add vote
        this_btn_opc.addClass('select_option_enc');
        btn_opc.each((index, element) => {
            $(element).append(`<div id="opcion${index + 1}" class="div_num_votos"><span class="span_num_vot cs-color-LightGrey">${percentages[index]}%</span></div>`);
        });
        $(`#span_total_enc-${data[0].value}`).text(`Votos: ${total}`);
    } else if (res.data.rep) {
        // Remove vote
        this_btn_opc.removeClass('select_option_enc');
        frmSubmit.parents('.caja_pub').find('.div_num_votos').remove();
        $(`#span_total_enc-${data[0].value}`).text(`Votos: ${total}`);
    } else {
        // Change vote
        frmSubmit.siblings('form').children('.btn_opc').removeClass('select_option_enc');
        this_btn_opc.addClass('select_option_enc');
        btn_opc.each((index, element) => {
            $(element).find(`#opcion${index + 1}`).html(`<span class="span_num_vot cs-color-LightGrey">${percentages[index]}%</span>`);
        });
        $(`#span_total_enc-${data[0].value}`).text(`Votos: ${total}`);
    }
}

/**
 * Handles reaction update logic
 * @param {Object} res - Response object
 * @param {jQuery} frmSubmit - Form element
 */
function handleReactionUpdate(res, frmSubmit) {
    const emojiElement = frmSubmit.find('.emogi_reaccion');

    if (res.data.ins) {
        emojiElement.addClass('emogi_click');
    } else if (res.data.rep) {
        emojiElement.removeClass('emogi_click');
    } else if (res.data.cam) {
        frmSubmit.parents('.div_int').find('.emogi_reaccion').removeClass('emogi_click');
        emojiElement.addClass('emogi_click');
    }
}

/**
 * Handles strategy update logic
 * @param {Object} res - Response object
 */
function handleStrategyUpdate(res) {
    $('.frm_edit_est').each((_index, element) => {
        const $element = $(element);
        if ($element.parent('.div_apply_est').data('idest') == res.data.id_Str) {
            $element.find('.p_alert_form_crear_estrategia').html(res.data.res);
            if (res.data.editEst) {
                $element.parent('.div_apply_est').replaceWith(res.data.EstrategiaActualizada);
                Config.showAlert(res.data.res);
            }
            return false; // Break the loop
        }
    });
}

/**
 * Main submit function with improved structure and error handling
 * @param {Object|string} data - Data to send with the request
 * @param {string} typeSuccess - Submit endpoint type
 * @param {jQuery} frmSubmit - Form element being submitted
 * @param {jQuery} load - Loading element to show/hide loading indicator
 */
export default function submit(data, typeSuccess, frmSubmit, load) {
    // Input validation
    if (!typeSuccess) {
        console.error('Submit: typeSuccess parameter is required');
        return;
    }

    // Enhanced logging
    console.log(`📤 Submit Request: ${typeSuccess}`, {
        data: typeof data === 'string' ? 'serialized' : data,
        hasForm: !!frmSubmit,
        hasLoadElement: !!load
    });

    // Determine request configuration
    const config = getRequestConfig(typeSuccess);

    $.ajax({
        type: config.method,
        url: config.url,
        data: data,
        dataType: config.dataType,
        processData: config.processData,
        contentType: config.contentType,
        beforeSend: function () {
            handleBeforeSend(typeSuccess, frmSubmit, load, config);
        },
        success: function (res) {
            handleSuccess(res, typeSuccess, data, frmSubmit, load, config);
        },
        error: function (error) {
            handleError(error, typeSuccess);
        },
        complete: function () {
            handleComplete(typeSuccess, frmSubmit, load, config);
        }
    });
}