export default function api(data, type, options, load) {
    console.dir('api(' + data + ', ' + type + ', ' + options + ', ' + load + ')');
    $.ajax({
        type: "POST",
        url: localStorage.getItem('base_url_api') + "/App/Config/Routes.php",
        data: data,
        dataType: "json",
        beforeSend: function () {
            load ? (load.css({ 'position': 'relative' }), load.append('<img class="img_loading" src="./Frontend/static/media/styles/icons/menu/logo_cargando.gif">')) : null;
            switch (type) {
                case 'cam-pag':
                    $('.img_loading').css({ height: '25%' });
                    break;
            }
        },
        success: function (res) {
            if (res.state === 'error') {
                alert(Object.values(res.alerts).join('. <br>'));
                return;
            }

            if (res.state === 'info') {
                alert(Object.values(res.alerts).join('. '));
            }

            const handlers = {
                'cam-pag': () => {
                    const img = options.parents('.pagination-container').siblings('.gallery-container').find('.fg_img_pub');
                    img.html(`<img data-idpub="${data.idpub}" class="pub_img" src="./Frontend/static/media/styles/user/publicaciones/imagenes/${res.archivo}" alt="img_pub">`).fadeOut(0).fadeIn(250);
                },
                'ver-per': () => {
                    $('#div_perfilusu').html(res.data.html);
                    if (Cookie.getCookie('TypeAcount') !== 'invitado') {
                        api({ publicaciones: true, idpubusu: res.data.idpubusu, typePub: 'pubUsu' }, 'pub-usu');
                    }
                },
                'api-cla': () => {
                    $('#div_infjug').html(res.data.html);
                    api({ es: true }, 'tra-es');
                },
                'show-pre': () => {
                    showDivToggle('showToggle');
                    showDivToggle('loadContent', res.data.inf.title, res.data.inf.content);
                },
                'ses-js': () => {
                    Cookie.setCookie('id', res.data.id);
                    Cookie.setCookie('dateBanHideAct', res.data.dateBanHideAct);
                },
                'inf-car': () => {
                    $('#div_card_info').html(res.data.html);
                    $('#div_card_info').scrollTop(0);
                },
                'cer-ses': () => {
                    Cookie.deleteAllCookies();
                    sessionStorage.clear();
                    res.data.cer_ses ? (location.href = './home') : alert(res.data.res);
                },
                'cre-maz': () => {
                    Deck.setCreatedDecks(res);
                },
                'apr-ord': () => {
                    if (res.data.error) {
                        $('#div_alert_shop_gems').html(res.data.res);
                    } else {
                        $('#span_gems').text(res.data.Gems);
                    }
                    Config.showAlert(res.data.res);
                },
                'sho-car': () => {
                    Deck.eliminarGifCargando();
                    Card.setCards(res);
                },
                'my-emo': () => {
                    $('.div_img_emote_enviar').html(res.data.html);
                },
                'tra-es': () => {
                    $.each(res.data.data, (key, value) => {
                        $('p').each((index, element) => {
                            const content = $(element).text();
                            if (content.includes(key)) {
                                const regex = new RegExp(`\\b${key}\\b`, 'g');
                                $(element).html(content.replace(regex, value));
                            }
                        });
                    });
                },
                'gua-maz': () => {
                    res.data.state == 'success' && (Cookie.setCookie('Mazos', res.data.Mazos), $('#main-deck-collection-alert').html(res.data.res));
                },
                'ini-gog': () => {
                    if (res.data.acount) {
                        res.data.new_user ? (Cookie.setCookie('bienvenida', false), location.href = './home?new_user=true') : (location.href = './home');
                    } else {
                        alert(res.data.res);
                    }
                },
                /*                 'get-com': () => {
                                    options.prepend(res.data.res);
                                    scrollToEnd($('.caja-coment'));
                                    load.data('getcom', 'yes');
                                }, */
                'get-not': () => {
                    showDivToggle('loadContent', 'Notificación', res.data.res);
                },
                'ins-vis': () => { },
                'get-rl': () => {
                    console.log(res);
                    showDivToggle('loadContent', res.data.inf.title, res.data.inf.content);
                },
                'get-sb': () => {
                    showDivToggle('loadContent', 'SobreNosotros', res.data.content);
                },
                'get-inf': () => {
                    showDivToggle('loadContent', res.data.title, res.data.content);
                },
                'pub-usu': () => {
                    $('#div_pubusu').html(res.data.html);
                    $('#div_perfilusu').scrollTop(0);
                },
                /*                 'pub-all': () => {
                                    $('#nuevaspublicaciones').html(res.data.html);
                                    lazyloading();
                                }, */
                /*                 'get-men': () => {
                                    $('#nuevomensaje_load_gif').css({ height: '0em' });
                                    if (res.data.idchat === Cookie.getCookie('id')) {
                                        $('#msg').val('');
                                        $('#nuevomensaje').append(res.data.html);
                                        scrollToEnd($('#nuevomensaje'));
                                    } else {
                                        if (Section.menuSection.menu_stay_selft !== 'cha') {
                                            Chat.chat_var.new_messages += res.data.num_messages;
                                            $('#btn_new_message').fadeIn(250);
                                            $('#span_new_mesasge').text(Chat.chat_var.new_messages);
                                        } else {
                                            $('#nuevomensaje').append(res.data.html);
                                            $('#btn_nuevos_mensajes').fadeIn(250);
                                            Chat.chat_var.new_messages += res.data.num_messages;
                                            $('#span_new_messages').text(Chat.chat_var.new_messages);
                                        }
                                    }
                                }, */
                /*                 'loa-men': () => {
                                    $('#nuevomensaje_load_gif').css({ height: '0em' });
                                    $('#nuevomensaje').prepend(res.data.html);
                                    Chat.chat_var.offset = res.data.idcar;
                                    console.log('idcar: ' + res.data.idcar);
                                    scrollToEnd($('#nuevomensaje'));
                                }, */
                'scr-men': () => {
                    $('#nuevomensaje_load_gif').css({ height: '0em' });
                    $('#nuevomensaje').prepend(res.data.html);
                    Chat.chat_var.offset = res.data.idcar;
                    Chat.chat_var.isRequesting = false;
                },
                'update': () => { },
                'get-sec': () => {
                    $('#div_sections_content').html(res.data.res).fadeIn(500);
                    $("#cargando").fadeOut(250);
                    //Section.saveSection(options.id.split('_')[2], res.data.res);
                    Section.afterGetSection({ id: options.id, body: options.body });
                },
                'det-maz': () => {
                    $('#div_res_ST').fadeIn(125);
                    $('#div_res_ana_maz').html(res.data.view);
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
                'ana-maz': () => {
                    $('#div_det_basic').html(res.data);
                },
                'get-sho': () => {
                    showDivToggle('loadContent', "Tienda", res.data.res);
                },
                'get-est': () => {
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
                'user-data': () => {
                    showDivToggle('loadContent', 'Mis Datos', res.data);
                },
                'get-settings': () => {
                    showDivToggle('loadContent', 'Configuración', res.data);
                },
                'get-gem': () => {
                    if (res.data.state == "success") {
                        $('#span_gems').text(res.data.data.Gems);
                        $('#div_alert_shop_gems').append(res.data.alerts[0]);
                    } else {
                        $('#div_alert_shop_gems').append(res.data.alerts[0]);
                    }
                    Config.showAlert(res.data.alerts[0]);
                },
                'deck-form': () => {
                    $('#div_frm_crear_mazo').html(res.data);
                }
            };

            if (handlers[type]) {
                handlers[type]();
            }

            console.log(res);
        },
        error: function (error) {
            alert('Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.');
            console.log(error);
        },
        complete: function () {
            load && load.find('.img_loading').remove();
        }
    });
}