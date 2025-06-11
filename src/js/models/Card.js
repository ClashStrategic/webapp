export default class Card {

    static stats = null;
    static media = null;

    static cardsByArena = '';
    static cardsByElixir = '';
    static cardsByRarity = '';
    static cardsByEvolution = '';

    static selCardEvent = null; // Variable para el evento de reemplazo de carta cuando el mazo está lleno
    static selectedCardToMove = null; // Carta seleccionada para mover
    static sourceSlot = null; // Slot original de la carta a mover
    static longPressTimer = null; // Temporizador para detectar toque largo
    static longPressDuration = 500; // Duración en ms para considerar toque largo
    static isLongPress = false; // Flag para indicar si se realizó un toque largo
    static touchStartX; // Coordenadas iniciales del toque para detectar movimiento
    static touchStartY; // Coordenadas iniciales del toque para detectar movimiento

    static orderCards() {
        console.log('orderCards()');
        let numbyOrdenCards = parseInt(Cookie.getCookie('byOrdenCards'));
        numbyOrdenCards++;
        if (numbyOrdenCards == 1) {
            $('#btn_Orden_cards').text('Por Defecto');
            $('#div_cards_all').html(Card.cardsByArena);
        } else if (numbyOrdenCards == 2) {
            $('#btn_Orden_cards').text('Por Elixir');
            $('#div_cards_all').html(Card.cardsByElixir);
        } else if (numbyOrdenCards == 3) {
            $('#btn_Orden_cards').text('Por Rareza');
            $('#div_cards_all').html(Card.cardsByRarity);
        } else if (numbyOrdenCards == 4) {
            $('#btn_Orden_cards').text('Por Evolucion');
            $('#div_cards_all').html(Card.cardsByEvolution);
        }
        //eliminara las cartas que ya estan en el mazo
        let cardsInMazo = $('#deck-slots-main').data('cards');
        let namesCardInMazo = [];
        if (cardsInMazo && $('#deck-slots-main').data('towercard')) {
            namesCardInMazo = $.map(cardsInMazo.concat($('#deck-slots-main').data('towercard')[0]), function (card) {
                return card.name;
            });
        }
        $('#div_cards_all .cs-card[data-inmazo="no"]').each(function () {
            $.inArray($(this).data('name'), namesCardInMazo) != -1 && $(this).parent('.cs-card-space').hide();
            $.inArray($(this).data('name'), namesCardInMazo) != -1 && $(this).remove();
        });
        numbyOrdenCards == 4 && (numbyOrdenCards = 0);
        Cookie.setCookie('byOrdenCards', numbyOrdenCards);
    }

    static setAdvancedOrder(dataOrder, order) {
        console.log('setAdvancedOrder(' + dataOrder + ', ' + order + ')');
        if (dataOrder) {
            let cards_slots_tower = $('#div_card_slot_tower .cs-card').clone();
            let cards_slots = $('#deck-slots-main .cs-card').clone();

            let card__space_tower = $.map($('#div_tower-card_containers .cs-card-space'), function (elementOrValue) {
                $(elementOrValue).find('.cs-card').length <= 0 && $(elementOrValue).append(cards_slots_tower.filter(function () {
                    return $(elementOrValue).data('id') == 'div_card_' + $(this).data('json').name;
                }))
                return elementOrValue;
            });
            let card__space_cards = $.map($('#div_card_containers .cs-card-space'), function (elementOrValue) {
                $(elementOrValue).find('.cs-card').length <= 0 && $(elementOrValue).append(cards_slots.filter(function () {
                    return $(elementOrValue).data('id') == 'div_card_' + $(this).data('json').name;
                }));
                return elementOrValue;
            });

            // Primero ordenar cartas por id
            if (dataOrder != "id") {
                card__space_cards.sort((a, b) => {
                    const dataA = $(a).children('.cs-card').data('json');
                    const dataB = $(b).children('.cs-card').data('json');
                    return compararCartas(dataA, dataB, 'id', 'asc');
                });
            }

            // Ordenar cartas de torre
            card__space_tower.sort((a, b) => {
                const dataA = $(a).children('.cs-card').data('json');
                const dataB = $(b).children('.cs-card').data('json');
                return compararCartas(dataA, dataB, dataOrder, order);
            });

            // Ordenar cartas normales
            card__space_cards.sort((a, b) => {
                const dataA = $(a).children('.cs-card').data('json');
                const dataB = $(b).children('.cs-card').data('json');
                return compararCartas(dataA, dataB, dataOrder, order, a);
            });

            function compararCartas(dataA, dataB, dataOrder, order, a) {
                if (dataA && dataB) {
                    // Verifica cartas no validas para ordenar
                    if ((((dataA.type === 'Spell' && !dataA.duration && !dataA.units) || dataA.suicide || !dataA.damage.level11 || !dataA.dps.level11) && dataOrder === 'dps') ||
                        ((dataA.type === 'Spell' && !dataA.units) && dataOrder === 'hitpoints') ||
                        (((dataA.type === 'Spell' && !dataA.units) || dataA.suicide || !dataA.damage.level11) && dataOrder === 'hitspeed') ||
                        (!dataA.damage.level11 && dataOrder === 'damage')
                    ) {
                        $(a).children('.cs-card').css('opacity', 0.75);
                        return order == 'asc' ? -1 : 1;
                    }

                    $(a).children('.cs-card').css('opacity', 1); // Restablecer la opacidad de las cartas válidas
                    const valueA = parseFloat(dataA[dataOrder].level11 ?? dataA[dataOrder]);
                    const valueB = parseFloat(dataB[dataOrder].level11 ?? dataB[dataOrder]);

                    if (order === 'asc') {
                        return valueA - valueB;
                    } else {
                        return valueB - valueA;
                    }
                } else {
                    return 0;
                }
            }

            // Filter cards that are in the deck
            let namesCardInMazo = $.map($('#deck-slots-main').data('cards'), function (card) { return card.name; });
            let namesCardInMazo_tower = $('#div_card_slot_tower .cs-card').length ? $('#div_card_slot_tower .cs-card').data('json').name : 'null';

            const filteredCard__space_tower = $.map(card__space_tower, function (card_space) {
                let card_space_new = $(card_space);
                card_space_new.find('.cs-card').data('name') == namesCardInMazo_tower && card_space_new.children('.cs-card').remove();
                return card_space_new;
            });

            const filteredCard__space_cards = $.map(card__space_cards, function (card_space) {
                let card_space_new = $(card_space);
                $('#deck-slots-main .cs-card').each(function (index, element) { //si la carta esta en el mazo, se le asigna el estilo de la carta en el mazo
                    if ($(element).data('name') == card_space_new.children('.cs-card').data('name'))
                        $(element).attr('style', card_space_new.find('.cs-card').attr('style'));
                });
                namesCardInMazo.some(name => name == card_space_new.find('.cs-card').data('json').name) && card_space_new.find('.cs-card').remove(); //si la carta esta en el mazo, se elimina de la lista de cartas
                return card_space_new;
            });

            $('#div_tower-card_containers').html(filteredCard__space_tower);
            $('#div_card_containers').html(filteredCard__space_cards);
            $('#btn_Orden_cards_advanced').text('Ordenar por ' + dataOrder);
        }
    }

    static setCards(res) {
        Card.stats = res.data.stats;
        Card.media = res.data.media;

        let orderById = [...Object.values(res.data.stats.cards)].sort((a, b) => a.id - b.id);
        let orderByElixir = [...Object.values(res.data.stats.cards)].sort((a, b) => a.elixirCost - b.elixirCost);
        let valRarity = ['Common', 'Rare', 'Epic', 'Legendary', 'Champion'];
        let orderByRarity = [...Object.values(res.data.stats.cards)].sort((a, b) => valRarity.indexOf(a.rarity) - valRarity.indexOf(b.rarity));
        let valEvo = ['si', 'no'];
        let orderByEvolution = [...Object.values(res.data.stats.cards)].sort((a, b) => valEvo.indexOf(a.evolution ? 'si' : 'no') - valEvo.indexOf(b.evolution ? 'si' : 'no'));

        $.each([orderById, orderByElixir, orderByRarity, orderByEvolution], function (index, value) {
            Config.renderTemplate("ShowCards", { stats: { cards: value, towerCards: res.data.stats.towerCards }, media: res.data.media }).then((html) => {
                if (index == 0) {
                    Card.cardsByArena = html;
                    $('#div_cards_all').html(Card.cardsByArena);
                    Cookie.setCookie('byOrdenCards', 1);
                    let TypeAcount = Cookie.getCookie('TypeAcount');
                    if (TypeAcount == 'invitado') {
                        let Mazos = Cookie.getCookie('Mazos');
                        if (!Mazos) Cookie.setCookie('Mazos', '["", "", "", "", "", "", "", "", "", ""]');
                    }
                    $('.cs-deck-collection__box-btns-option[data-nmazo=1]').click();
                    Cookie.setCookie('nmazo', 1);
                } else if (index == 1)
                    Card.cardsByElixir = html;
                else if (index == 2)
                    Card.cardsByRarity = html;
                else if (index == 3)
                    Card.cardsByEvolution = html;
            });
        });

        $('#btn_Orden_cards').prop('disabled', false);
    }

    // Selecciona una carta para moverla
    static selectCardForMove(cardElement) {
        if (Card.selectedCardToMove && Card.selectedCardToMove[0] === cardElement[0]) {
            // Deseleccionar si se vuelve a seleccionar la misma carta
            cardElement.removeClass('card--selected-move');
            Card.selectedCardToMove = null;
            Card.sourceSlot = null;
            console.log("Card deselected for move.");
        } else {
            // Deseleccionar cualquier otra carta previamente seleccionada
            if (Card.selectedCardToMove) {
                Card.selectedCardToMove.removeClass('card--selected-move');
            }
            // Seleccionar la nueva carta
            Card.selectedCardToMove = cardElement;
            Card.sourceSlot = cardElement.parent('.cs-deck__slot');
            Card.selectedCardToMove.addClass('card--selected-move');
            // Ocultar opciones mientras se mueve
            Card.selectedCardToMove.find('.cs-card__options').stop(true, true).slideUp(100);
            console.log("Card selected for move:", Card.selectedCardToMove.data('name'), "from slot:", Card.sourceSlot.attr('id'));
            // Podrías añadir feedback visual o háptico aquí
            //User.userInteracted && $('#audio_select_card')[0]?.play(); // Sonido de selección (si existe)
        }
    }

    // Cancela la selección de mover carta
    static cancelCardMoveSelection() {
        if (Card.selectedCardToMove) {
            Card.selectedCardToMove.removeClass('card--selected-move');
            Card.selectedCardToMove = null;
            Card.sourceSlot = null;
            console.log("Card move selection cancelled.");
        }
    }

    // Lógica para mover/intercambiar cartas (se implementará más adelante)
    static moveOrSwapCard(targetSlotElement) {
        if (!Card.selectedCardToMove || !Card.sourceSlot) return; // No hay carta seleccionada

        const targetSlot = targetSlotElement;

        if (Card.sourceSlot[0] === targetSlot[0]) {
            // Si se selecciona el mismo slot de origen, cancelar
            Card.cancelCardMoveSelection();
            return;
        }

        console.log("Attempting to move", Card.selectedCardToMove.data('name'), "from", Card.sourceSlot.attr('id'), "to", targetSlot.attr('id'));

        const sourceCardData = Card.selectedCardToMove.data('json');
        const sourceIndex = Card.sourceSlot.attr('id').split('-')[2] - 1; // Índice basado en 0
        const targetIndex = targetSlot.attr('id').split('-')[2] - 1; // Índice basado en 0

        let targetCard = null;
        let targetCardData = null;

        if (targetSlot.data('lleno') === 'yes') {
            targetCard = targetSlot.children('.cs-card');
            targetCardData = targetCard.data('json');
        }

        // --- Manejo de Imágenes de Evolución ---
        function updateEvolutionImage(slot, card, cardData) {
            const isEvoSlot = slot.attr('id') === 'cs-deck__slot-1' || slot.attr('id') === 'cs-deck__slot-2';
            const imageElement = card.find('.cs-card__image');
            if (cardData.evolution) {
                const imageUrl = isEvoSlot ? cardData.iconUrls.evolutionMedium : cardData.iconUrls.medium;
                if (imageElement.attr('src') !== imageUrl) {
                    imageElement.attr('src', imageUrl);
                    console.log(`Updated image for ${cardData.name} in slot ${slot.attr('id')} to ${imageUrl}`);
                }
            } else {
                // Asegurarse de que la imagen sea la normal si no tiene evo o no está en slot evo
                if (imageElement.attr('src') !== cardData.iconUrls.medium) {
                    imageElement.attr('src', cardData.iconUrls.medium);
                    console.log(`Ensured normal image for ${cardData.name} in slot ${slot.attr('id')}`);
                }
            }
        }

        // Actualizar imagen de la carta movida (ahora en targetSlot)
        updateEvolutionImage(targetSlot, Card.selectedCardToMove, sourceCardData);

        // Actualizar imagen de la carta intercambiada (si hubo, ahora en sourceSlot)
        if (targetCard) {
            updateEvolutionImage(Card.sourceSlot, targetCard, targetCardData);
        }

        // --- Ejecución del Movimiento/Intercambio ---

        // Actualizar el array de cartas en el DOM
        let newDeckData = []; // Array para almacenar las cartas del mazo
        // Recorrer los slots del mazo y agregar las cartas al array
        $('#deck-slots-main .cs-deck__slot').each(function (index, element) {
            $(element).find('.cs-card').length > 0 ? newDeckData.push($(element).find('.cs-card').data('json')) : newDeckData.push({ name: 'null' });
        });

        // Verificar si el slot destino está lleno y si la carta a mover es diferente a la carta en el slot destino
        if (targetCardData) { // Intercambio de cartas
            newDeckData[targetIndex] = sourceCardData; // Reemplazar carta en el slot destino
            newDeckData[sourceIndex] = targetCardData; // Reemplazar carta en el slot origen
        } else { // Solo mover carta
            newDeckData[targetIndex] = sourceCardData;
            newDeckData[sourceIndex] = { name: 'null' };
        }

        // Actualizar el array de cartas en el DOM
        newDeckData = newDeckData.filter(item => item.name !== 'null'); // Filtra los objetos donde 'name' no es 'null'
        $('#deck-slots-main').data('cards', newDeckData); // Guardar el array actualizado
        console.log("Deck Data updated:", newDeckData);

        // Actualizar DOM
        if (targetCard) { // Intercambio de cartas
            Card.sourceSlot.append(targetCard); // Mover carta destino al slot origen
            targetSlot.append(Card.selectedCardToMove); // Mover carta origen al slot destino
            targetCard.click(); // Deseleccionar carta origen
        } else { // Solo mover carta
            targetSlot.append(Card.selectedCardToMove).data('lleno', 'yes').css({ 'background': 'transparent', 'border': 'none', 'box-shadow': 'none' });
            Card.sourceSlot.data('lleno', 'no').css({ 'border': '1px solid var(--cs-color-LightGrey)' }); // Vaciar slot origen
            // Restaurar estilos por defecto si es slot de evo
            if (Card.sourceSlot.attr('id') === 'cs-deck__slot-1' || Card.sourceSlot.attr('id') === 'cs-deck__slot-2') {
                Card.sourceSlot.attr('style', '');
            }
        }

        console.log("Move/Swap successful.");
        //User.userInteracted && $('#audio_move_card')[0]?.play(); // Sonido de movimiento (si existe)

        // Limpiar selección después del movimiento/intercambio exitoso
        Card.cancelCardMoveSelection();
    }

    // --- Métodos Estáticos para Manejar Eventos de Click ---

    /**
     * Maneja el evento de click en un elemento de carta.
     * Muestra u oculta las opciones de la carta y actualiza el texto del botón.
     * @param {jQuery} cardElement - El elemento jQuery de la carta clickeada.
     */
    static handleClick(cardElement) {
        User.userInteracted && $('#audio_tap_card')[0]?.play();
        // Oculta opciones de otras cartas y quita la clase 'card--show-opt'
        $('.cs-card__options').not(cardElement.find('.cs-card__options')).slideUp(100);
        $('.cs-card').not(cardElement).removeClass('card--show-opt');

        const options = cardElement.find('.cs-card__options');
        const isInDeck = cardElement.data('inmazo') === 'yes'; // Corregido: 'yes' en lugar de 'si'

        if (options.is(':visible')) {
            // Si las opciones ya están visibles, las oculta y quita la clase
            options.slideUp(100);
            cardElement.removeClass('card--show-opt');
        } else {
            // Si las opciones están ocultas, las muestra y añade la clase
            options.slideDown(250);
            cardElement.addClass('card--show-opt');
            // Actualiza el texto del botón según si está en el mazo o no
            options.find('.cs-card__use-remove').text(isInDeck ? 'Eliminar' : 'Usar');
        }
    }

    /**
     * Maneja el evento de click en el botón de información de una carta.
     * Muestra un popup con la información detallada de la carta.
     * @param {jQuery} buttonElement - El elemento jQuery del botón clickeado.
     */
    static handleInfoButtonClick(buttonElement) {
        const cardElement = buttonElement.closest('.cs-card'); // Usar closest para asegurar que encontramos el padre .card
        const cardName = cardElement.data('name');
        const cardType = cardElement.data('type');
        let cardStats = cardType === 'tower' ? Object.values(Card.stats.towerCards).filter(card => card.name == cardName)[0] :
            Object.values(Card.stats.cards).filter(card => card.name == cardName)[0];

        // Definición de todas las estadísticas básicas
        let statsInfo = {
            basicStats: [
                {
                    label: 'Rareza',
                    icon: './static/media/styles/icons/info-circle.svg',
                    value: cardStats.rarity ?? 'Común',
                    alt: 'rareza'
                }
                ,
                {
                    label: 'Costo de Elixir',
                    icon: './static/media/styles/icons/card_stat_inf/icon_gota_elixir.webp',
                    value: cardStats.elixirCost ?? 0,
                    alt: 'elixir'
                }
                ,
                {
                    label: 'Unidades',
                    icon: './static/media/styles/icons/card_stat_inf/count.webp',
                    value: cardStats.units ?? 1,
                    alt: 'unidades'
                }
                ,
                {
                    label: 'Evolución',
                    icon: './static/media/styles/icons/card_stat_inf/evolution.webp',
                    value: (cardStats.evolution ?? false) ? 'Si' : 'No',
                    alt: 'evo'
                }
                ,
                {
                    label: 'Tipo',
                    icon: './static/media/styles/icons/info-circle.svg',
                    value: cardStats.type ?? 'Tropa',
                    alt: 'tipo'
                }
                ,
                {
                    label: cardStats.range ? 'Alcance' : (cardStats.radius ? 'Radio' : 'Alcance/Radio'),
                    icon: cardStats.radius ?
                        './static/media/styles/icons/card_stat_inf/radius.webp' :
                        './static/media/styles/icons/card_stat_inf/range.webp',
                    value: cardStats.range ? cardStats.range :
                        (cardStats.radius ? cardStats.radius : 'N/A'),
                    alt: cardStats.radius ? 'radius' : 'range'
                }
                ,
                {
                    label: 'Velocidad',
                    icon: './static/media/styles/icons/card_stat_inf/speed.webp',
                    value: cardStats.speed ?? 'N/A',
                    alt: 'speed'
                }
                ,
                {
                    label: 'Vlc. de Ataque',
                    icon: './static/media/styles/icons/card_stat_inf/hit-speed.webp',
                    value: cardStats.hitspeed ?? 'N/A',
                    alt: 'hit-speed'
                }
            ],
            // Estadísticas de niveles (11 y 15)
            levelStats: [
                {
                    label: 'Vida',
                    icon: './static/media/styles/icons/card_stat_inf/hitpoints.webp',
                    property: 'hitpoints',
                    alt: 'hitpoints'
                },
                {
                    label: 'Daño',
                    icon: './static/media/styles/icons/card_stat_inf/damage.webp',
                    property: 'damage',
                    alt: 'damage'
                },
                {
                    label: 'DPS',
                    icon: './static/media/styles/icons/card_stat_inf/damagepersec.webp',
                    property: 'dps',
                    alt: 'damagepersec'
                },
                {
                    label: 'Daño Mortal',
                    icon: './static/media/styles/icons/card_stat_inf/deathdamage.webp',
                    property: 'FatalDamage',
                    alt: 'deathdamage',
                    conditional: true
                },
                {
                    label: 'Daño a Torre',
                    icon: './static/media/styles/icons/card_stat_inf/crowntowerdamage.webp',
                    property: 'TowerDamage',
                    alt: 'crowntowerdamage',
                    conditional: true
                }
            ]
        };

        $('#capa_contenido').fadeIn(250);
        $('#div_card_info').css({ height: '55%', top: '23%' }).fadeToggle(250);
        // Limpiar contenido anterior y mostrar loading
        $('#div_card_info').empty().append('<div class="div_loading_toggle" style="margin-top: 50%; margin-bottom: 50%;"></div>');

        Config.renderTemplate("StatsCardView", { card: { stats: cardStats, media: Card.media[cardName] }, statsInfo: statsInfo }).then(html => {
            $('#div_card_info').html(html);
            $('#div_card_info').scrollTop(0);
        });
    }

    /**
     * Maneja el evento de click en el botón "Usar" o "Eliminar" de una carta.
     * Llama a los métodos correspondientes de la clase Deck para añadir/eliminar la carta.
     * @param {jQuery} buttonElement - El elemento jQuery del botón clickeado.
     */
    static handleAddRemoveButtonClick(buttonElement) {
        const cardElement = buttonElement.closest('.cs-card'); // Usar closest
        const cardJson = cardElement.data('json');
        const cardName = cardElement.data('name');
        const cardType = cardElement.data('type');

        // Llama al método apropiado en Deck
        if (cardType === 'tower') {
            Deck.addDeleteTowerCard(cardElement, cardJson, cardName);
        } else {
            Deck.addDeleteCard(cardElement, cardJson, cardName);
        }

        // Analiza el mazo si está completo después de la acción
        if ($('#deck-slots-main').data('cards')?.length === 8 && $('#deck-slots-main').data('towercard')?.length === 1) {
            let cardsNames = $('#deck-slots-main').data('cards').map(card => card.name);
            cardsNames.push($('#deck-slots-main').data('towercard')[0].name);
            Deck.analyzeBasic(cardsNames);
        } else {
            $('#div_det_basic').html(Deck.incompleteDeckMessage);
        }
    }

    /**
     * Maneja el evento de click en un slot de carta vacío.
     * Realiza un scroll hacia la sección de selección de cartas.
     * @param {jQuery} slotElement - El elemento jQuery del slot clickeado.
     */
    static handleEmptySlotClick(slotElement) {
        // Verifica si el slot está realmente vacío y si el click fue directamente en el slot
        if (slotElement.data('lleno') === 'no' && slotElement.is(event.target)) {
            const nextSection = slotElement.closest('section').next('section');
            if (nextSection.length) {
                $('html, body').animate({ scrollTop: nextSection.offset().top }, 500);
            }
        }
    }

    /**
      * Maneja el evento de click en un slot de carta cuando se está moviendo otra carta.
      * Llama a la función para mover o intercambiar la carta.
      * @param {jQuery} slotElement - El elemento jQuery del slot de destino clickeado.
      */
    static handleMoveTargetSlotClick(slotElement) {
        if (Card.selectedCardToMove) {
            Card.moveOrSwapCard(slotElement);
        }
    }

    /**
     * Maneja el evento de click en el botón para cancelar el reemplazo de una carta.
     * Restaura la interfaz y limpia el evento de selección.
     */
    static handleCancelReplaceClick() {
        // Habilita botones de cartas y mazo
        $('.cs-card').find('button').prop('disabled', false).css({ opacity: 1 });
        $('#main-deck-collection-box-btns').find('div, button').prop('disabled', false).css({ opacity: 1 });
        // Limpia mensajes de alerta
        $('#main-deck-collection-alert').html('');
        // Desvincula el evento de click si existe
        if (Card.selCardEvent) {
            Card.selCardEvent.off('click');
            Card.selCardEvent = null;
        }
        console.log("Card replacement cancelled.");
    }

    /**
     * Maneja el evento de click en el botón para ordenar las cartas.
     * Llama al método estático orderCards.
     */
    static handleOrderButtonClick() {
        Card.orderCards();
    }

    /**
     * Maneja el evento de click en el botón de orden avanzado de cartas.
     * Muestra u oculta el panel de opciones avanzadas.
     */
    static handleAdvancedOrderButtonClick() {
        let html = `<form class="frm frm--primary" autocomplete="off"
                    onchange="Card.setAdvancedOrder($(this).find('select[name=keyOrder]').val(), $(this).find('input[name=typeOrder]:checked').val())">
                    <label>Por <select name="keyOrder" class="select">
                            <option value="" selected disabled>Valor</option>
                            <option value="id">id</option>
                            <option value="units">Unidades</option>
                            <option value="hitspeed">Velocidad Ataque</option>
                            <option value="damage">Daño</option>
                            <option value="dps">Daño por segundo</option>
                            <option value="hitpoints">Puntos de Vida</option>
                        </select>
                    </label><br><br>
                    <input type="radio" name="typeOrder" value="asc" id="orden_asc" checked><label for="orden_asc">Acendente</label><br>
                    <input type="radio" name="typeOrder" value="desc" id="orden_desc"><label for="orden_desc">Descendente</label>
                </form>`;
        Config.showDivToggle('showToggle');
        Config.showDivToggle('loadContent', 'Orden Avanzado', html);
    }

    // --- Métodos Estáticos para Manejar Otros Eventos (Toque Largo) ---

    /**
     * Maneja el inicio de un toque en una carta del mazo (para toque largo en móvil).
     * @param {jQuery} cardElement - El elemento jQuery de la carta tocada.
     * @param {TouchEvent} event - El objeto del evento táctil original.
     */
    static handleCardTouchStart(cardElement, event) {
        // Solo iniciar si no hay ya una carta seleccionada para mover
        if (!Card.selectedCardToMove) {
            Card.touchStartX = event.originalEvent.touches[0].clientX;
            Card.touchStartY = event.originalEvent.touches[0].clientY;
            Card.isLongPress = false; // Resetea el flag

            clearTimeout(Card.longPressTimer); // Limpia cualquier timer anterior
            Card.longPressTimer = setTimeout(() => {
                Card.isLongPress = true; // Marcar que fue toque largo
                console.log("Long Press detected on card:", cardElement.data('name'));
                Card.selectCardForMove(cardElement);
                // Prevenir que se muestren las opciones de la carta después del toque largo
                cardElement.find('.cs-card__options').stop(true, true).slideUp(0);
            }, Card.longPressDuration);
        }
    }

    /**
     * Maneja el final de un toque en una carta del mazo.
     * Limpia el temporizador del toque largo y resetea el flag isLongPress.
     */
    static handleCardTouchEnd() {
        clearTimeout(Card.longPressTimer); // Cancelar el timer si se levanta el dedo antes
        // Si fue un toque largo, el flag Card.isLongPress ya está true
        // y el click normal será ignorado por la condición al inicio del handler de click.
        // Reseteamos Card.isLongPress después de un pequeño delay para asegurar que el click no se procese.
        setTimeout(() => { Card.isLongPress = false; }, 50);
    }

    /**
     * Maneja el movimiento del dedo durante un toque en una carta del mazo.
     * Cancela el temporizador del toque largo si el movimiento es significativo.
     * @param {TouchEvent} event - El objeto del evento táctil original.
     */
    static handleCardTouchMove(event) {
        // Si el dedo se mueve significativamente, cancelar el toque largo
        const touchEndX = event.originalEvent.touches[0].clientX;
        const touchEndY = event.originalEvent.touches[0].clientY;
        // Comprobar si touchStartX/Y están definidos antes de calcular la diferencia
        if (typeof Card.touchStartX !== 'undefined' && typeof Card.touchStartY !== 'undefined' &&
            (Math.abs(touchEndX - Card.touchStartX) > 10 || Math.abs(touchEndY - Card.touchStartY) > 10)) {
            clearTimeout(Card.longPressTimer);
            Card.isLongPress = false; // Asegurarse de que no se marque como toque largo si hubo movimiento
        }
    }
}
