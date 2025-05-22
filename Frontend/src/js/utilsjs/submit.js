export default function submit(data, typeSuccess, frmSubmit, load) {
    console.dir('submit(' + data + ', ' + typeSuccess + ', ' + frmSubmit + ')');
    if (typeSuccess == 'ins-pub' || typeSuccess == 'ins-ava') {
        $.ajax({
            url: localStorage.getItem('base_url_api') + '/App/Config/Routes.phpp',
            type: 'POST',
            data: data,
            dataType: 'json',
            processData: false,
            contentType: false,
            beforeSend: function () {
                load ? (load.css({ 'position': 'relative' }), load.append('<img class="img_loading" src="./Frontend/static/media/styles/icons/menu/logo_cargando.gif">')) : null;
            },
            success: function (res) {
                if (res.state == 'error') {
                    alert((Object.values(res.alerts)).join('. '));
                    return;
                }
                load ? load.find('.img_loading').remove() : null;
                switch (typeSuccess) {
                    case 'ins-pub': //insersion de publicaciones
                        if (res.data.success) {
                            frmSubmit[0].reset();
                            frmSubmit.find('#div_show_img_pub').hide();
                            $('#alertp1').html(res.data.res);
                            setTimeout(() => {
                                $('#alertp1').html('');
                            }, 4000);
                        } else {
                            $('#alertp1').html(res.data.res);
                        }
                        break;
                    case 'ins-ava': //cambair avatar
                        res.data.success && $('.avatar_perfil, .img_banner_perfil').attr('src', './Frontend/static/media/styles/user/avatars/' + res.data.avatar);
                        $('#res-ava').html(res.data.res)
                        break;
                }
                // Config.updates();
                console.log(res);
            },
            error: function (error) {
                alert('ha ocurrido un error, intentelo mas tarde');
                console.log(error);
            },
            complete: function () {
                $("#publicar").prop("disabled", false);
            }
        });
    } else {
        $.ajax({
            type: 'POST',
            url: './App/Config/Routes.php',
            data: data,
            dataType: 'json',
            beforeSend: function () {
                frmSubmit.find('[type=submit]').prop("disabled", true); //desactiva el boton submit para evitar errores
                load ? (load.css({ 'position': 'relative' }), load.append('<img class="img_loading" src="./Frontend/static/media/styles/icons/menu/logo_cargando.gif">')) : null;
                switch (typeSuccess) {
                    case 'ins-rea':
                        load && load.find('.img_loading').css({ height: '50%' });
                        break;
                }
            },
            success: function (res) {
                if (res.state == 'error') {
                    alert((Object.values(res.alerts)).join('. <br>'));
                    return;
                }
                frmSubmit.children('.alert_frm').html(res.data.res);
                switch (typeSuccess) {
                    /*                     case 'env-men': //enviar mensaje de chat
                                            frmSubmit[0].reset(); //limpiar el input
                                            $('#div_content_re_men_inp').html('');
                                            $('#div_res_men_inp').fadeOut(250)
                                            $('#frm_chat').find('[name=reply]').val('no');
                                            Config.x_button('div_emotes_enviar'); //si envio un emote
                                            scrollToEnd($('#nuevomensaje'));
                                            $('.img_emote_enviar').removeClass('select_emote');
                                            break; */
                    case 'env-enc': //enviar encuesta
                        if (res.data.success) {
                            $('#frm_enc')[0].reset();
                            $('#span_alert_enc').html(res.data.res);
                            setTimeout(() => {
                                $('#span_alert_enc').html('');
                            }, 4000);
                        } else {
                            $('#span_alert_enc').html(res.data.res);
                        }
                        $('[name="submit_frmencuesa"]').prop("disabled", false);
                        break;
                    /*                     case 'env-com': //enviar comentario
                                            if (res.data.success) {
                                                $('.txt_comentar').val('');
                                                frmSubmit.parents('.div_coment').find('.inf_com').text(''); //elimina Sin comentario cuando se evnia uno si esqu existe el mensaje
                                                frmSubmit.parents('.div_coment').find('.nuevocoment').append('<br><div class="mensajes_usu caja_pub"><div class="div_logo perfil_pub"><img class="avatar" src="./Frontend/static/media/styles/user/avatars/' + res.data.avatar + '"><span style="white-space: pre"> </span><a class="a_nom_men" data-name="' + res.data.usuario + '">' + res.data.nombre + '</a><div class="div_fecha"><span class="span_fec_men_usu">' + res.data.datetime + '</span></div></br></div><div class="div_mensaje nuevomensaje"><span class="span_mensaje_usu">' + data.comlink + '</span></div></div>');
                                                scrollToEnd($('.caja-coment'));
                                            } else {
                                                $('#div_com_res').html(res.data.res);
                                            }
                                            break; */
                    case 'ins-inf': //completar inf
                        $('#div_infusu p').html(res.data.inf);
                        break;
                    case 'set-tag':
                        $('#frm_complete_tag')[0].reset();
                        $('#div_alert_frm_compreg').html(res.data.alerts[0] ?? '');
                        res.success && $('.div_frm_compdat').fadeOut(250);
                        break;
                    case 'opc-enc': //clicks a opciones de encuesta
                        if (res.data.error) {
                            alert(res.data.res);
                        } else {
                            let btn_opc = frmSubmit.parents('.caja_pub').find('.btn_opc');
                            let this_btn_opc = frmSubmit.find('button');
                            let total = res.data.Votos1 + res.data.Votos2 + res.data.Votos3;
                            const promedios = [Math.round((res.data.Votos1 / total) * 100), Math.round((res.data.Votos2 / total) * 100), Math.round((res.data.Votos3 / total) * 100)];

                            if (res.data.new) { //añadir % en los button y añadir votos
                                this_btn_opc.addClass('select_option_enc');
                                btn_opc.each(function (index, element) {
                                    $(element).append('<div id="opcion' + (index + 1) + '" class="div_num_votos"><span class="span_num_vot cs-color-LightGrey">' + promedios[index] + '%</span></div>');
                                });
                                $('#span_total_enc-' + data[0].value).text('Votos: ' + total);
                            } else {
                                if (res.data.rep) { //eliminar el % de los button y eliminar voto
                                    this_btn_opc.removeClass('select_option_enc');
                                    frmSubmit.parents('.caja_pub').find('.div_num_votos').remove();
                                    $('#span_total_enc-' + data[0].value).text('Votos: ' + total);
                                } else { //cambiar el voto
                                    frmSubmit.siblings('form').children('.btn_opc').removeClass('select_option_enc');
                                    this_btn_opc.addClass('select_option_enc');
                                    btn_opc.each(function (index, element) {
                                        $(element).find('#opcion' + (index + 1)).html('<span class="span_num_vot cs-color-LightGrey">' + promedios[index] + '%</span>');
                                    });
                                    $('#span_total_enc-' + data[0].value).text('Votos: ' + total);
                                }
                            }
                        }
                        break;
                    case 'ins-rea': //insertar reacciones
                        const Reacciones = [res.data.Reaccion1, res.data.Reaccion2, res.data.Reaccion3, res.data.Reaccion4];
                        frmSubmit.parents('.div_int').find('span').each(function (index, element) {
                            $(element).text(Reacciones[index]);
                        });
                        if (res.data.ins) {
                            frmSubmit.find('.emogi_reaccion').addClass('emogi_click');
                        } else if (res.data.rep) {
                            frmSubmit.find('.emogi_reaccion').removeClass('emogi_click');
                        } else if (res.data.cam) {
                            frmSubmit.parents('.div_int').find('.emogi_reaccion').removeClass('emogi_click');
                            frmSubmit.find('.emogi_reaccion').addClass('emogi_click');
                        }
                        $(".btn_reac1, .btn_reac2, .btn_reac3, .btn_reac4").prop("disabled", false);
                        break;
                    case 'ins-reg': //usurio intentando registrarse
                        res.data.login && ($('#frm_registro input').val(''), Cookie.setCookie('bienvenida', false));
                        res.data.login ? (location.href = './home?new_user=true') : $('#alert_reg').html(res.data.res);
                        !res.data.login && load && load.find('.img_loading').remove();
                        break;
                    case 'log-usu': //usuario intentando loguearse
                        res.data.login && ($('#loginform input').val(''), $('#alert_log').html(res.data.res));
                        res.data.login ? location.href = './home' : $('#alert_log').html(res.data.res);
                        !res.data.login && load && load.find('.img_loading').remove();
                        break;
                    case 'cam-ban': //cambiar banner
                        $('#img_banner_per_usu').attr('src', './Frontend/static/media/styles/user/banners/' + res.data.Banner);
                        $('#div_alert_cam_ban').html(res.data.res);
                        break;
                    case 'get-coi': //comprar monedas y recibir monedas y gemas gratis en shop
                        Config.showAlert(res.data.res);
                        $('#span_coins').text(res.data.Coins);
                        $('#span_gems').text(res.data.Gems);
                        res.data.purchase && !res.data.getCoins && (frmSubmit.find('.btn_purchase').html('<span style="font-size: var(--text-font-size-p3)">¡Reclamado!</span>'));
                        break;
                    case 'get-emo': //comprar emotes
                        Config.showAlert(res.data.res);
                        $('#span_coins').text(res.data.Coins);
                        $('#span_gems').text(res.data.Gems);
                        res.data.purchase && frmSubmit.find('.btn_purchase').html('<span style="font-size: var(--text-font-size-p2)" class="text">¡Comprado!</span>');
                        break;
                    case 'set-est': //crear estrategias
                        if (res.data.editEst || res.data.id_Str) {
                            $('.frm_edit_est').each(function (index, element) {
                                if ($(element).parent('.div_apply_est').data('idest') == res.data.id_Str) {
                                    $(element).find('.p_alert_form_crear_estrategia').html(res.data.res);
                                    res.data.editEst && $(element).parent('.div_apply_est').replaceWith(res.data.EstrategiaActualizada);
                                    res.data.editEst && Config.showAlert(res.data.res);
                                    return;
                                }
                            });
                        } else {
                            $('#frm_crear_estrategia').find('.p_alert_form_crear_estrategia').html(res.data.res);
                        }
                        break;
                }
                //typeSuccess != 'ins-reg' && typeSuccess != 'log-usu' && Config.updates();
                console.log(res);
            },
            error: function (error) {
                alert('Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.');
                console.log(error);
            },
            complete: function () {
                if (typeSuccess != 'ins-reg' && typeSuccess != 'log-usu') { //no oculta el gif cargando si se esta registrando o logueando
                    load && load.find('.img_loading').remove();
                }
                frmSubmit.find('[type=submit]').prop("disabled", false); //activa el boton submit
            }
        });
    }
}