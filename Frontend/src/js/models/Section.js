export default class Section {
    static menuSection = { menu_stay_selft: 'publicacion', data: { viewElement: false } };

    /*     static saveSection(section, content) { //guardar el contenido de cada seccion al ser requerido por primera vez
    
        } */

    static afterGetSection(options) {
        switch (options.id) {
            case 'a_menu_shop':
                options.body = 2;
                Section.menuSection.menu_stay_selft = 'sho';
                Section.menuSection.data.viewElement && ($('html, body').animate({ scrollTop: $('#' + Section.menuSection.data.viewElement).offset().top - 150 }, 500), Section.menuSection.data.viewElement = false);
                break;
            case 'a_menu_cartas':
                Deck.cargandoMazo();
                Card.cardsByArena == '' && api({ showCards: true }, 'sho-car', null, $('#div_cards_all'));//cargar cartar solo la primera vez
                if (Card.cardsByArena) { //si ya se cargaron las cartas
                    $('#div_cards_all').html(Card.cardsByArena); //si ya cargo las cartas solo insertarlas al div
                    let byOrdenCardsOld = Cookie.getCookie('byOrdenCards'); //guardar la cookie en la variable
                    Cookie.setCookie('byOrdenCards', 1);
                    Cookie.getCookie('nmazo') > 5 && $('#btn_cam_mazos').click(); //click para mistrar los botones del 6 al 10
                    $('.cs-deck-collection__box-btns-option[data-nmazo=' + Cookie.getCookie('nmazo') + ']').click(); //click al en el que se guardo en la cookie
                    $('#btn_Orden_cards').prop('disabled', false); //se activa el boton de orden
                    for (let i = 1; i < (byOrdenCardsOld == 0 ? 4 : byOrdenCardsOld); i++) {
                        $("#btn_Orden_cards").click();
                    }
                }
                Section.menuSection.menu_stay_selft = 'car';
                break;
            case 'a_menu_publicacion':
                api({ publicaciones: true, typePub: 'pubAll' }, 'pub-all', null, $('#nuevaspublicaciones')); //carga publicaciones iniciales
                Config.hideAct();
                $('#div_banner_anuncios').slick({
                    autoplay: true,
                    autoplaySpeed: 10000,
                    dots: true,
                    appendDots: $('#div_banner_anuncios'),
                    dotsClass: 'slick-dots',
                });
                Section.menuSection.menu_stay_selft = 'pub';
                break;
            /*             case 'a_menu_ch4t':
                            api({ getEmogis: true }, 'my-emo');
                            Chat.chat_var.new_messages = 0;
                            Chat.chat_var.offset = 0;
                            $('#btn_new_message').fadeOut(250);
                            $('#span_new_mesasge').text(Chat.chat_var.new_messages);
                            loadMessages();
                            $('#nuevomensaje').on('scroll', function () { //scroll caja mensajes
                                mensajesnuevosvisto();
                                scrolllistener();
                                lazyloading();
                            });
                            Section.menuSection.menu_stay_selft = 'cha';
                            break; */
        }
        //$('body').css({ 'background': 'var(--background-body' + options.body + ') fixed' });
        $('.diamond').css({ 'background': 'var(--background-body' + options.body + '-diamond)' });
        $('.a_menu').removeClass('a_menu_select');
        $('#' + options.id).addClass('a_menu_select');
        // lazyloading();
        //updates();
    }
}
