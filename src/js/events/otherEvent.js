export default function otherEvent() {

    // Evento para mostrar información al pasar el mouse sobre un elemento o al tocarlo en dispositivos móviles con la clase 'cs-tooltip-image'
    $(document).on('mouseenter touchstart', '.cs-tooltip-image', function (e) {
        if ((e.type == 'mouseenter' && !Config.isMobile()) || (e.type == 'touchstart' && Config.isMobile())) {
            let div_inf = $('#cs-tooltip-box').html('<span class="cs-tooltip__message">' + $(this).data('inf') + '</span>').fadeIn(0); // Actualiza el contenido
            let divWidth = parseFloat($(this).data('width') ?? '8em') * 16;
            let divHeight = div_inf.height();
            let leftPos = Math.max(0, Math.min($(this).offset().left - divWidth / 2, $(window).width() - divWidth - 12));
            let topPos = $(this).offset().top - divHeight - 12;
            $(this).data('overflow') && $('#cs-tooltip-box').css({ 'max-height': '20em', 'overflow-y': 'auto' });

            // Aplica la posición al elemento
            $('#cs-tooltip-box').css({
                'width': divWidth + 'px',
                'left': leftPos + 'px',
                'top': topPos + 'px'
            });
        }
    }).on('mouseleave', '.cs-tooltip-image', function (e) {
        if ((e.type == 'mouseleave' && !Config.isMobile())) {
            $('#cs-tooltip-box').fadeOut(250);
        }
    });

    //activacion del lazy loading
    $(window).scroll(function () {
        //lazyloading();
    });

    $(document).on('input', '#inp_ran_def, #inp_ran_hab', function () {
        $(this).attr('id') == 'inp_ran_def' ? $('#span_ran_def').text($(this).val()) : null;
    });

    //cambiar avatar y mostrar img de publicacion antes de enviarlo
    $(document).on('input', '#text_inf', function () {
        $('#contador').text($('#text_inf').val().length);
    });

    $(document).on('change', '#cam_ava, #file-1', function () {
        const reader = new FileReader();
        reader.readAsDataURL(this.files[0]);
        reader.onload = () => {
            if ($(this).attr('id') == 'cam_ava') {
                $('#img_ava_preview').slideDown(250).attr('src', reader.result);
            }
            if ($(this).attr('id') == 'file-1') { //para mostrar las img pub
                let numImagesLoaded = 0;
                const numImages = this.files.length;
                $('#div_show_img_pub').slideDown(250).html('<div id="div_show_car_img"></div>');
                Array.from(this.files).forEach(file => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        const imgHtml = `<img class="img_show_pub" src="${reader.result}">`;
                        $('#div_show_car_img').append(imgHtml);
                        numImagesLoaded++;
                        if (numImagesLoaded === numImages) {
                            Config.addSlick('img', '#div_show_car_img', 1, true);
                        }
                    };
                });
            }
        };
    });

    // Manejo de toque largo en mensajes de chat
    $(document).on('mousedown touchstart', '.MsgChat', function () {
        // Solo iniciar en touchstart para evitar duplicidad en móvil
        if (event.type === 'touchstart' || (event.type === 'mousedown' && !Config.isMobile())) {
            Chat.handleMessageTouchStart($(this));
        }
    }).on('mousemove touchmove', '.MsgChat', function () { // Delegar al MsgChat para precisión
        // Solo marcar como movido en touchmove
        if (event.type === 'touchmove') {
            Chat.handleMessageTouchMove();
        }
    }).on('mouseup touchend touchcancel', '.MsgChat', function () { // Incluir touchcancel
        Chat.handleMessageTouchEnd();
    });


    //muesetra error
    $(window).on('error', (error) => { console.log(error); });

    // al interactuar el usuario
    $(document).on('mousemove touchmove mouseup touchend keydown mousedown touchstart', function () {
        // Llama al método estático para manejar la interacción
        User.handleUserInteraction();
    });

    //menu
    $(document).on('click', "#a_menu_shop, #a_menu_cartas, #a_menu_publicacion, #a_menu_ch4t", function () {
        console.log('click menu ' + $(this).attr('id'));
        let id = $(this).attr('id');
        $("#div_sections_content").fadeOut(100);
        $("#cargando").fadeIn(250);
        let section = localStorage.getItem(id.split('_')[2]);
        if (section && Cookie.getCookie('CSDate') == Cookie.getCookie('SectionVersion')) { //si la seccion guardad si existe
            $('#div_sections_content').html(section);
            //afterGetSection({ id: id, body: '' });
        } else { //si no existe la seccion guardada 
            api({ getSections: id.split('_')[2] }, 'get-sec', { id: id, body: '' }, null); //hacer la solicitud de las seccion
        }
    });

    /* $('#frm_chat textarea').on('input', function () {
  if ($(this).prop('scrollHeight') > 300) {
    $(this).css('height', 300 + 'px'); // Limitar la altura al máximo
  }
}); */

    // --- Inicio: Eventos para Mover Cartas ---

    // Doble Clic en Carta (Desktop)
    $(document).on('dblclick', '#deck-slots-main .cs-card', function (e) {
        console.log("Double Click on Card detected!");
        e.stopPropagation(); // Evita que otros listeners de click se activen
        e.preventDefault();
        Card.selectCardForMove($(this));
    });

    // Doble Clic en Slot (Desktop - Destino)
    $(document).on('dblclick', '#deck-slots-main .cs-cs-deck__slot', function (e) {
        console.log("Double Click on Slot detected!");
        e.stopPropagation();
        e.preventDefault();
        if (Card.selectedCardToMove) {
            Card.moveOrSwapCard($(this));
        }
    });

    // Toque Largo en Carta (Mobile) - Inicio
    $(document).on('touchstart', '#deck-slots-main .cs-card', function (e) {
        Card.handleCardTouchStart($(this), e);
    });

    // Toque Largo en Carta (Mobile) - Fin/Cancelación
    $(document).on('touchend touchcancel', '#deck-slots-main .cs-card', function () {
        Card.handleCardTouchEnd();
    });

    // Toque Largo en Carta (Mobile) - Movimiento
    $(document).on('touchmove', '#deck-slots-main .cs-card', function (e) {
        Card.handleCardTouchMove(e);
    });

    // --- Fin: Eventos para Mover Cartas ---

}
