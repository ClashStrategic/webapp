export default class Chat {
    static chat_var = { messages_vistos: 0, new_messages: 0, idcha_men: null, emote: null, res_men: null, timer: null, MsgChat: null, isTouchMoved: false, isRequesting: false, offset: 0 };

    static mensajesnuevosvisto() {
        console.log("mensajesnuevosvisto();");
        $('.MsgChat').each(function () {
            let id = parseInt($(this).attr('id'));
            let previous = parseInt(Config.jsonupdates.pre_num_row_cha);
            previous -= Chat.chat_var.new_messages;
            if (id > previous) {
                let isVisible = $(this).offset().top < $(window).scrollTop() + $(window).height() - 135;
                if (isVisible) {
                    Chat.chat_var.new_messages--;
                    Chat.chat_var.messages_vistos++;
                    $('#span_new_messages').text(Chat.chat_var.new_messages);
                    if (Chat.chat_var.new_messages == 0) {
                        $('#btn_nuevos_mensajes').fadeOut(250);
                    }
                }
            }
        });
    }

    static loadMessages() {
        console.log('loadMessages()');
        api({ mensajes: true, offset: Chat.chat_var.offset }, 'loa-men', null, $('#nuevomensaje_load_gif'));
        console.log('offset: ' + Chat.chat_var.offset);
    }

    //cargar mensajes anteriores(arriba de los mensahes atuales)
    static scrolllistener() {
        console.log("scrolllistener()");
        if ($('#nuevomensaje').scrollTop() < 750 && !Chat.chat_var.isRequesting && Chat.chat_var.offset > 0) {
            Chat.chat_var.isRequesting = true;
            $('#nuevomensaje_load_gif').css({ height: '3.5em' });
            api({ mensajes: true, offset: Chat.chat_var.offset }, 'scr-men', null, $('#nuevomensaje_load_gif'));
        }
    }

    //verificacion de nuevos mensajes y carga nuevos mensajes
    static loadNewChatMessages() {
        console.log('loadNewChatMessages()');
        if (Config.jsonupdates.new_cha) {
            api({ mensajes: true, pre_num_row_cha: Config.jsonupdates.pre_num_row_cha }, 'get-men');
        }
    }

    //Bajar al final del elemento
    static scrollToEnd(element) {
        console.log('scrollToEnd(' + element + ')');
        element.scrollTop(element.prop('scrollHeight'));
    }

    // --- Métodos Estáticos para Manejar Eventos de Click ---

    /**
     * Maneja el click en el botón "Responder" de un mensaje.
     * Prepara el formulario para enviar una respuesta a ese mensaje específico.
     * @param {jQuery} buttonElement - El elemento jQuery del botón "Responder" clickeado.
     */
    static handleReplyButtonClick(buttonElement) {
        // Encuentra el elemento padre del mensaje (.MsgChat)
        const messageElement = buttonElement.closest('.MsgChat');
        if (!messageElement.length) {
            console.error("No se pudo encontrar el elemento .MsgChat padre.");
            return;
        }

        // Guarda la referencia al mensaje actual en la variable estática
        Chat.chat_var.MsgChat = messageElement;

        // Clona el contenido del mensaje para mostrarlo en la vista previa
        const replyContent = messageElement.clone();
        // Opcional: Podrías querer limpiar o simplificar el contenido clonado
        // replyContent.find('.reply-btn').remove(); // Quitar el botón de responder del clon

        // Oculta el botón "Responder" en el mensaje original
        messageElement.find('.reply-btn').fadeOut(250);

        // Configura el formulario de chat para la respuesta
        const chatForm = $('#frm_chat');
        chatForm.find('[name=reply]').val('yes'); // Indica que es una respuesta
        chatForm.find('[name=idcha]').val(messageElement.data('idcha')); // Establece el ID del mensaje al que se responde

        // Muestra la vista previa de la respuesta
        $('#div_content_re_men_inp').html(replyContent); // Inserta el contenido clonado
        $('#div_res_men_inp').fadeIn(250); // Muestra el contenedor de la vista previa

        // Opcional: Enfoca el campo de entrada de texto para facilitar la escritura
        chatForm.find('[name=msg]').trigger('focus'); // O .click() si prefieres ese comportamiento
        console.log("Reply mode activated for message ID:", messageElement.data('idcha'));
    }

    /**
     * Maneja el click en el botón para cancelar el modo de respuesta.
     * Restaura el formulario de chat a su estado normal.
     */
    static handleCancelReplyClick() {
        const chatForm = $('#frm_chat');

        // Restablece los valores del formulario
        chatForm.find('[name=reply]').val('no');
        chatForm.find('[name=idcha]').val('');

        // Limpia y oculta la vista previa de la respuesta
        $('#div_content_re_men_inp').html('');
        $('#div_res_men_inp').fadeOut(250);

        // Opcional: Vuelve a mostrar el botón "Responder" en el mensaje original si existe una referencia
        if (Chat.chat_var.MsgChat) {
            Chat.chat_var.MsgChat.find('.reply-btn').fadeIn(250);
            // Chat.chat_var.MsgChat = null; // Limpiar la referencia si ya no es necesaria
        }

        console.log("Reply mode cancelled.");
    }

    /**
     * Maneja el click en el botón para abrir el selector de emotes.
     * Prepara el formulario de emotes con la información de respuesta si existe.
     */
    static handleOpenEmoteSelectorClick() {
        const emoteForm = $('#frm_emote');
        const chatForm = $('#frm_chat');

        $("#btn_frm_emote_enviar").prop("disabled", true); // Deshabilitar envío hasta seleccionar emote
        $('#div_emotes_enviar').fadeIn(250);
        $('#capa_contenido').fadeIn(250);

        // Pasar información de respuesta si está activa
        emoteForm.find('input[name="idcha"]').val(chatForm.find('[name=idcha]').val());
        emoteForm.find('input[name="reply"]').val(chatForm.find('[name=reply]').val());

        console.log("Emote selector opened.");
    }

    /**
     * Maneja el click en un emote específico para seleccionarlo.
     * @param {jQuery} emoteElement - El elemento jQuery del emote clickeado.
     */
    static handleSelectEmoteClick(emoteElement) {
        const emoteValue = emoteElement.data('emote');

        // Resaltar emote seleccionado y quitar resaltado de otros
        $('.img_emote_enviar').removeClass('select_emote');
        emoteElement.addClass('select_emote');

        // Asignar valor al formulario y habilitar envío
        $('#frm_emote input[name="msg"]').val(emoteValue);
        $("#btn_frm_emote_enviar").prop("disabled", false);

        console.log("Emote selected:", emoteValue);
    }

    /**
     * Maneja el click en la vista previa de un mensaje respondido.
     * Hace scroll hasta el mensaje original.
     * @param {jQuery} repliedMessagePreviewElement - El elemento jQuery de la vista previa clickeada.
     */
    static handleScrollToRepliedMessageClick(repliedMessagePreviewElement) {
        const originalMessageId = repliedMessagePreviewElement.data('idrescha');
        const originalMessageElement = $('#' + originalMessageId); // Busca por ID directamente

        if (originalMessageElement.length) {
            // Usa scrollIntoView para asegurar visibilidad
            originalMessageElement[0].scrollIntoView({ behavior: 'smooth', block: 'center' }); // Opciones para scroll suave y centrado

            // Añade clase para feedback visual y la quita después de un tiempo
            originalMessageElement.addClass('scrollmsgres');
            setTimeout(() => {
                originalMessageElement.removeClass('scrollmsgres');
            }, 1500); // Duración del resaltado

            console.log("Scrolled to replied message ID:", originalMessageId);
        } else {
            console.warn("Could not find original message element with ID:", originalMessageId);
        }
    }

    // --- Métodos Estáticos para Manejar Otros Eventos ---

    /**
     * Inicia el temporizador para detectar un toque largo en un mensaje.
     * @param {jQuery} messageElement - El elemento jQuery del mensaje (.MsgChat) tocado.
     */
    static handleMessageTouchStart(messageElement) {
        Chat.chat_var.MsgChat = messageElement; // Guardar referencia al mensaje actual
        Chat.chat_var.isTouchMoved = false; // Resetear flag de movimiento

        // Limpiar temporizador anterior si existe
        clearTimeout(Chat.chat_var.timer);

        Chat.chat_var.timer = setTimeout(() => {
            // Ejecutar solo si el dedo no se ha movido
            if (!Chat.chat_var.isTouchMoved) {
                console.log("Long press detected on message ID:", messageElement.data('idcha'));
                // Vibrar si es soportado
                'vibrate' in navigator && window.navigator.vibrate(100);

                // Ocultar opciones de otros mensajes y mostrar las de este
                $('.MsgChat').not(messageElement).removeClass('div_tap_res');
                $('.MsgChat').not(messageElement).find('.div_res').fadeOut(250);
                messageElement.addClass('div_tap_res');
                messageElement.find('.div_res').fadeIn(250);
            }
        }, 750); // Duración del toque largo
    }

    /**
     * Marca que el dedo se ha movido durante un toque, cancelando el toque largo.
     */
    static handleMessageTouchMove() {
        Chat.chat_var.isTouchMoved = true;
        // Opcional: Podrías limpiar el temporizador aquí también si prefieres
        // clearTimeout(Chat.chat_var.timer);
    }

    /**
     * Limpia el temporizador del toque largo cuando se levanta el dedo.
     */
    static handleMessageTouchEnd() {
        clearTimeout(Chat.chat_var.timer);
        // No es necesario resetear isTouchMoved aquí, se hace en touchstart
    }
}
