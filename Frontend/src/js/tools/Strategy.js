export default class Strategy {
    static seleccionPov(div_apply_est) { //seleccion los valores de las estrategias del form recibido para su edicion
        console.log('seleccionPov(' + div_apply_est + ')');

        const formEst = div_apply_est.find('form');
        let mensajes = div_apply_est.data('mensajes');
        let puntos = div_apply_est.data('puntos');
        let condicionesArr = div_apply_est.data('condiciones');

        formEst.find('button[type="submit"]').text('Editar la Estrategia');
        formEst.removeAttr('id');
        formEst.find('label').eq(0).text('');
        formEst.find('br').eq(0).remove();
        formEst.addClass('frm_edit_est');
        formEst.prepend('<input type="hidden" name="Estrategia[id_Str]" value="' + div_apply_est.data('idest') + '">');
        formEst.find('input[name="Estrategia[Nombre]"]').val(div_apply_est.data('nombre'));
        formEst.find('textarea[name="Estrategia[description]"]').val(div_apply_est.data('descripcion'));
        formEst.find('select[name="Estrategia[Visibilidad]"').val(div_apply_est.data('visibilidad'));

        $.each(condicionesArr, function (index0, value0) {
            index0 > 0 && formEst.find('.btn_new_con').trigger('click'); // Usamos trigger para simular el evento click
            // Corregido: Se elimina el parámetro no usado 'value2'
            $.each(value0, function (index2) {
                index2 > 0 && formEst.find('.fs_condition .btn_add_pov').eq(index0).trigger('click'); // Simular el evento click
            });
        });

        $.each(condicionesArr, function (index, value) {
            formEst.find('.fs_condition select[name="Condiciones[Puntos][]"]').eq(index).val(puntos[index] == 1 ? '1.0' : puntos[index]);
            formEst.find('.fs_condition input[name="Condiciones[Mensajes][]"]').eq(index).val(mensajes[index]);
            $.each(value, function (index2, value2) {
                let typeComparator = value2['normal'] ? 'normal' : 'mazo';
                formEst.find('.fs_condition').eq(index).find('.fs_pov').eq(index2).find('select').eq(0).val(typeComparator).change();
                formEst.find('.fs_condition').eq(index).find('.fs_pov').eq(index2).find('select[name="Condiciones[comparadores][' + typeComparator + '][' + index + '][propiedades][]"]').find('option[value="' + value2[typeComparator]['property'] + '"]').prop('selected', true).change();
                formEst.find('.fs_condition').eq(index).find('.fs_pov').eq(index2).find('select[name="Condiciones[comparadores][' + typeComparator + '][' + index + '][operadores][]"]').val(value2[typeComparator]['operator']);
                formEst.find('.fs_condition').eq(index).find('.fs_pov').eq(index2).find('select[name="Condiciones[comparadores][' + typeComparator + '][' + index + '][valores][]"]').val(value2[typeComparator]['value']);
                value2[typeComparator]['logicalOperator'] != null && formEst.find('.fs_condition .fs_povs').eq(index).find('select[name="Condiciones[logicalOperators][' + index + '][]"]').eq(index2).val(value2[typeComparator]['logicalOperator']);
            });
        });
    }

    static setFunctionEstrategies() {
        console.log('setFunctionEstrategies()');

        //<img class="cs-tooltip-image" src="./Frontend/static/media/styles/icons/info-circle.svg" alt="inf" data-inf="Elige si tu Estrategia sera visible y seleccionable por otros Usuarios para Crear sus Mazos">
        return `<div class="div_details_estrategia"><details>
                        <summary class="cs-color-GoldenYellow">¡Crea tus Estrategias!</summary>
                        <p class="cs-color-LightGrey">Crea tus propias estrategias y condiciones para personalizar y optimizar tus mazos de Clash Royale de manera más efectiva. Define las reglas que mejor se adapten a tu estilo de juego y descubre nuevas combinaciones ganadoras.</p>
                    </details>
                    <details>
                        <summary class="cs-color-GoldenYellow">¿Qué son las estrategias?</summary>
                        <p class="cs-color-LightGrey">Las Estrategias son un Conjunto de Condiciones para Filtrar Cartas y lograr Crear un Mazo Estratégico.</p>
                    </details>
                    <details>
                        <summary class="cs-color-GoldenYellow">Orden de las condiciones (Y/O)</summary>
                        <p class="cs-color-LightGrey">En las condiciones, "Y" (AND) se evalúa antes que "O" (OR). Por ejemplo: si tienes "Comparación1 O Comparación2 Y Comparación3", primero se evalúan "Comparación2 Y Comparación3".</p>
                    </details>`+
            /* <details>
                <summary class="cs-color-GoldenYellow">Iteración de comparadores</summary>
                <p class="cs-color-LightGrey">Normal: Cartas que todavia no fueron seleccionadas en el mazo que se intenta crear.</p>
                <p class="cs-color-LightGrey">Mazo: Cartas que ya estan seleccionadas en el mazo que se intenta crear.</p>
            </details> */
            `<br><br>
                    </div>
                    <form id="frm_crear_estrategia" class="frm frm--primary" data-ajax-success="set-est" autocomplete="off">
                    <h3 class="cs-color-GoldenYellow">Estrategia</h3>
                    <label>Nombre:</label><br>
                    <input type="text" name="Estrategia[Nombre]" placeholder="Nombre de la estrategia" maxlength="30" required><br>
                    <label>Descripcion:</label><br>
                    <textarea name="Estrategia[description]" class="w-75" placeholder="Descripción de la estrategia max(1500)caracteres" maxlength="1500" required></textarea><br>
                    <label>Visibilidad:</label><br>
                   <select name="Estrategia[Visibilidad]" required>
                     <option value="Publico" selected>Publico</option>
                     <option value="Privado">Privado</option>
                   </select><br><br>
                   <div class="div_sistem_card">
                    <p class="cs-color-GoldenYellow">Sistema Selección de Cartas: </p>
                        <fieldset class="fs_iter_cards">
                            <legend>iteracion en 
                            <select name="">
                            <option value="allCards" selected>Todas las Cartas</option>
                            <option value="" disabled>Proximo</option>
                            </select>
                            </legend>
                            <div class="div_new_condition">${Strategy.getCondition(0, 0)}</div>
                            <button class="btn_new_con cs-btn cs-btn--medium cs-btn--primary btn_add_condition" type="button" onclick="Strategy.addCondicion($(this))">+</button>
                        </fieldset>
                        <button type="button" class="cs-btn cs-btn--medium cs-btn--primary btn_add_iter_cards" onclick="alert('No Disponible')">+</button>
                    </div><br>
                    <button type="submit" class="cs-btn cs-btn--medium cs-btn--primary">Crear</button>
                    <p class="p_alert_form_crear_estrategia"></p>
                </form>`;
    }

    static elimCon(btn_eliminar_con_pov) {
        console.log('elimCon(' + btn_eliminar_con_pov + ')');
        if (btn_eliminar_con_pov.parents('form').hasClass('frm_edit_est')) {
            alert('No puedes eliminar Condiciones de una Estrategia ya Creada, intenta editarla o Crear otra Estrategia');
            return;
        }
        let formCon = btn_eliminar_con_pov.parent('.fs_condition').siblings('.fs_condition');
        btn_eliminar_con_pov.parent('.fs_condition').remove();
        $(formCon).each(function (index, element) {
            $(element).find('.btn_add_pov').attr('onclick', 'Strategy.addPov($(this),  ' + index + ', ' + index + ')');
            let div_povopt = $(element).find('.div_povopt');
            $(div_povopt).each(function (indexpov, pov) {
                $(pov).find('select').eq(0).attr('name', 'Condiciones[logicalOperators][' + index + '][]');
                $(pov).find('.fs_pov select').eq(0).attr('name', 'Condiciones[comparadores][' + index + '][propiedades][]');
                $(pov).find('.fs_pov select').eq(1).attr('name', 'Condiciones[comparadores][' + index + '][operadores][]');
                $(pov).find('.fs_pov select').eq(2).attr('name', 'Condiciones[comparadores][' + index + '][valores][]');
            });
        });
    }

    static elimPov(btn_eliminar_con_pov) {
        console.log('elimPov(' + btn_eliminar_con_pov + ')');
        btn_eliminar_con_pov.parents('.div_povopt').remove();
    }

    static comparationIn(select, condicionIndexFun, type) {
        console.log('comparationIn(' + select + ', ' + condicionIndexFun + ', ' + type + ')');
        select.siblings('select').eq(0).attr('name', 'Condiciones[comparadores][' + type + '][' + condicionIndexFun + '][propiedades][]');
        select.siblings('select').eq(1).attr('name', 'Condiciones[comparadores][' + type + '][' + condicionIndexFun + '][operadores][]');
        select.siblings('select').eq(2).attr('name', 'Condiciones[comparadores][' + type + '][' + condicionIndexFun + '][valores][]');
    }

    //<img class="cs-tooltip-image" src="./Frontend/static/media/styles/icons/info-circle.svg" alt="inf" data-inf="Es un Conjunto de Comparaciones para validar una Condicion y sumar puntos">
    static getCondition = (condicionIndexFun, logicalOperatorIndexFun) => {
        console.log('getCondition(' + condicionIndexFun + ', ' + logicalOperatorIndexFun + ')');
        return `<fieldset class="fs_condition">` +
            (condicionIndexFun > 0 ? '<button type="button" class="btn_eliminar_con_pov" onclick="Strategy.elimCon($(this))">X</button>' : '') +
            `<legend>Condicion</legend>
        <div class="fs_povs"><div class="div_povopt">` + Strategy.addPovInit(condicionIndexFun, 0) + `</div></div>
            <button class="btn_add_pov cs-btn cs-btn--medium cs-btn--primary" type='button' onclick="Strategy.addPov($(this), ` + condicionIndexFun + `, ` + logicalOperatorIndexFun + `)">+</button>
            <br><select name="Condiciones[Puntos][]" class="sel_points_condition" required>
                <option value="" selected disabled>Puntos</option>
                <option value="0.25">+0.25</option>
                <option value="0.50">+0.50</option>
                <option value="0.75">+0.75</option>
                <option value="1.0">+1.0</option>
            </select>
            <input type="text" name="Condiciones[Mensajes][]" class="inp_msg_condition" placeholder="Mensaje de Condicion" maxlength="250" required>
        </fieldset>`;
    }

    static addCondicion(btn_new_con) { //agrega una nueva condicion
        console.log('addCondicion()');
        let numfs_condition = btn_new_con.siblings('.div_new_condition').children('.fs_condition').length;
        if ((numfs_condition + 1) > 5) {
            alert('Limite alcanzado, No puedes agregar mas de 5 Condiciones en una Estrategia');
            return;
        }
        btn_new_con.siblings('.div_new_condition').append(Strategy.getCondition(numfs_condition, numfs_condition));
    }

    static addPov(btn, condicionIndexFun, logicalOperatorIndexFun) { //agrega Propiedad Operador y Valor
        console.log('addPov()');
        let povsNum = btn.siblings('.fs_povs').children('.div_povopt').length;
        if ((povsNum + 1) > 5) {
            alert('Limite alcanzado, No puedes agregar mas de 5 Comparaciones en una Condición');
            return;
        }
        btn.siblings('.fs_povs').append(`<div class="div_povopt">
            <select name="Condiciones[logicalOperators][` + logicalOperatorIndexFun + `][]" required>
                <option value="" selected disabled>Operador Lógico</option>
                <option value="AND" title="Se evaluan primero">Y</option>
                <option value="OR" title="Se evaluan despues de Y">O</option>
            </select>
            ${Strategy.addPovInit(condicionIndexFun, povsNum)}</div>`);
    }

    static addPovInit(condicionIndexFun, povsNum) {
        console.log('addPovInit(' + condicionIndexFun + ', ' + povsNum + ')');
        return `<fieldset class="fs_pov">` +
            `<legend class="cs-bg-color-1">Comparador</legend>` +
            (povsNum > 0 ? '<button type="button" class="btn_eliminar_con_pov" onclick="Strategy.elimPov($(this))">-</button>' : '') +
            `<label class="cs-color-DeepBlue font-size-1">iteración en: </label>
        <select class="font-size-1" onChange="Strategy.comparationIn($(this), ${condicionIndexFun}, $(this).val())">
            <option value="normal" title="sin iteracion adicional" selected>Normal</option>
            <option value="mazo" title="iteracion en cartas seleccionadas(mazo)" disabled>Mazo</option>
        </select><br>` +
            `<select name="Condiciones[comparadores][normal][` + condicionIndexFun + `][propiedades][]" onChange="Strategy.setValCon($(this));" required>
                    <optgroup>
                        <option value="" selected disabled>Propiedad</option>
                        <option value="elixirCost">Costo de Elixir</option>
                        <option value="arena" disabled>Arena</option>
                        <option value="units">Unidades</option>
                        <option value="groupCard">groupCard</option>
                        <option value="type">Tipo De carta</option>
                        <option value="TypeAttack">Tipo de Ataque</option>
                        <option value="Attack">Objetivo</option>
                        <option value="range">Rango</option>
                        <option value="rarity">Calidad</option>
                        <option value="evolution">Evolucion</option>
                        <option value="proyectil">Proyectil</option>
                        <option value="speed">speed</option>
                        <option value="territory">territory(solo hechizos)</option>
                        <option value="dps11">dps Nivel 11</option>
                        <option value="dps15" disabled>dps Nivel 15</option>
                        <option value="damage11">Daño Nivel 11</option>
                        <option value="damage15" disabled>Daño Nivel 15</option>
                        <option value="hitpoints11">Vida Nivel 11</option>
                        <option value="hitpoints15" disabled>Vida Nivel 15</option>
                        <option value="hitspeed">Velocidad</option>
                        <option value="special">Habilidad</option>
                        <option value="champeonAbility">Habilidad (Campeon)</option>
                        <option value="specialEvo" disabled>Habilidad (Evolución)</option>
                    </optgroup>
                </select>
                <select class="sel_operador" name="Condiciones[comparadores][normal][` + condicionIndexFun + `][operadores][]" required>
                    <option value="" selected disabled>Operador</option>
                    <option value="==">Igual a </option>
                    <option value=">">Mayor que </option>
                    <option value="<">Menor que </option>
                    <option value=">=">Mayor o Igual que </option>
                    <option value="<=">Menor o Igual que </option>
                    <option value="!=">No Igual a </option>
                    <option value="in">Tiene </option>
                </select>
                <select class="sel_valor" name="Condiciones[comparadores][normal][` + condicionIndexFun + `][valores][]" required>
                    <option value="" selected disabled>Valor</option>
                </select>
                </fieldset>`;
    }

    static setValCon(select) {
        console.log('setValCon()');
        let select_valor = select.siblings('.sel_valor');
        let selelct_operador = select.siblings('.sel_operador');
        let val = select.val();
        let arrIterValor = []; //valores que veran los usuarios en las opciones
        let valOpt = false; //valores que se eviaran al servidor
        let arroperator = {
            '==': 'Igual a',
            '>': 'Mayor que',
            '<': 'Menor que',
            '>=': 'Mayor o Igual que',
            '<=': 'Menor o Igual que',
            '!=': 'No Igual a'
        };

        let objOptArr = {
            'in': 'Tiene'
        }

        let objOptBi = {
            '==': 'Igual a',
            '!=': 'No Igual a'
        }

        val == 'elixirCost' && (arrIterValor = ['1', '2', '3', '4', '5', '6', '7', '8', '9']);
        val == 'arena' && (arrIterValor = ['1', '2', '3', '4', '5', '6', '7', '8', '9']);
        val == 'units' && (arrIterValor = ['1', '2', '3', '4', '5', '10', '15', '20']);
        val == 'groupCard' && (arroperator = objOptBi) && (arrIterValor = ['Win Condition', 'Terestre', 'Aereo', 'Defensa de Win', 'Hechizo']) && (valOpt = ['win', 'ter', 'aer', 'dew', 'hech']);
        val == 'type' && (arroperator = objOptBi) && (arrIterValor = ['Tropa', 'Estructura', 'Hechizo', 'Torre']) && (valOpt = ['Troop', 'Building', 'Spell', 'Tower']);
        val == 'TypeAttack' && (arroperator = objOptBi) && (arrIterValor = ['Amplio', 'Unico']) && (valOpt = ['splash', 'unique']);
        val == 'Attack' && (arroperator = objOptBi) && (arrIterValor = ['Estructuras', 'Terrestre', 'Aereo', 'Hechizo']) && (valOpt = ['est', 'ter', 'aer', 'hech']);
        val == 'range' && (arrIterValor = ['Cuarpo a Cuerpo', '3 casillas', '4 casillas', '5 casillas', '6 casillas', '7 casillas', '8 casillas', '9 casillas']) && (valOpt = ['Melee', '3', '4', '5', '6', '7', '8', '9']);
        val == 'rarity' && (arroperator = objOptBi) && (arrIterValor = ['Comun', 'Especial', 'Epico', 'Legendario', 'Campeón']) && (valOpt = ['Common', 'Rare', 'Epic', 'Legendary', 'Champion']);
        val == 'evolution' && (arroperator = objOptBi) && (arrIterValor = ['Disponible', 'No Disponible']) && (valOpt = [1, 0]);
        val == 'proyectil' && (arroperator = objOptBi) && (arrIterValor = ['Si', 'No']) && (valOpt = [1, 0]);
        val == 'speed' && (arroperator = objOptBi) && (arrIterValor = ['Lento', 'Medio', 'Veloz', 'Muy Veloz']) && (valOpt = ['Slow', 'Medium', 'Fast', 'Very Fast']);
        val == 'territory' && (arroperator = objOptBi) && (arrIterValor = ['Completo', 'Restringido']) && (valOpt = ['Wide', 'Restricted']);
        val == 'dps11' && (arrIterValor = ['25', '50', '75', '100', '125', '150', '175', '200', '250', '300', '400', '500']);
        val == 'dps15' && (arrIterValor = ['25', '50', '75', '100', '125', '150', '175', '200', '250', '300', '400', '500']);
        val == 'damage11' && (arrIterValor = ['25', '50', '75', '100', '125', '150', '175', '200', '250', '300', '400', '500', '600', '700', '800', '900', '1000']);
        val == 'damage15' && (arrIterValor = ['25', '50', '75', '100', '125', '150', '175', '200', '250', '300', '400', '500', '600', '700', '800', '900', '1000']);
        val == 'hitpoints11' && (arrIterValor = ['25', '50', '75', '100', '125', '150', '175', '200', '250', '300', '400', '500', '600', '700', '800', '900', '1000', '1250', '1500', '1750', '2000', '2500', '3000', '4000', '5000']);
        val == 'hitpoints15' && (arrIterValor = ['25', '50', '75', '100', '125', '150', '175', '200', '250', '300', '400', '500']);
        val == 'hitspeed' && (arrIterValor = ['0.50s', '0.75s', '1.0s', '1.25s', '1.5s', '1.75s', '2.0s', '2.25s', '2.5s', '2.75s', '3.0s', '4.0s', '5.0s']) && (valOpt = ['0.25', '0.50', '0.75', '1.0', '1.25', '1.50', '1.75', '2.0', '2.25', '2.50', '2.75', '3.0', '4.0', '5.0']);
        val == 'special' && (arroperator = objOptArr) && (arrIterValor = ['reset', 'boost', 'freeze', 'agroup', 'slowDown', 'move', 'generationUnits', 'division', 'chargeDamage', 'shield', 'transportation', 'reach', 'dpsIncrement', 'differentUnits', 'invisible', 'multipleLives', 'healing', 'damageReturn', 'unitConversion', 'bomb', 'elixirGeneration', 'Duplicate']);
        val == 'champeonAbility' && (arroperator = objOptArr) && (arrIterValor = ['boost', 'dpsIncrement', 'generationUnits', 'invisible', 'chargeDamage', 'shield', 'damageReturn', 'move', 'recolectorAlmas']);
        val == 'specialEvo' && (arroperator = objOptArr) && (arrIterValor = ['dpsIncrement', 'generationUnits', 'invisible', 'chargeDamage', 'shield', 'damageReturn', 'move', 'recolectorAlmas', 'rangeUp', 'powerShopRange', 'powerShotDamage', 'bounceDamage', 'hitspeedUp', 'tornadoRadius', 'toranadoDamage', 'tornadoDuration', 'unitsUp', 'unitsIncrement', 'push', 'barbarosBoost', 'pushBack', 'recoilDamage', 'iceBlastDamage', 'pulseDamage', 'pulseRadius', 'Duplicate', 'zap', 'radius']);

        !valOpt && (valOpt = arrIterValor); //si los valore para ser eviados esta vacio, asiganrle los de valo que son para ver por los usuarios
        select_valor.html(''); //vacia las opciones del select de valor
        $.each(arrIterValor, function (index, value) {
            select_valor.append(`<option value="${valOpt[index]}"` + (index == 0 ? 'selected' : '') + `>${value}</option>`);
        });
        selelct_operador.html(''); //vacia las opciones del select de valor
        let primerOperador = true; // Variable para controlar el primer operador
        $.each(arroperator, function (index, value) {
            let selected = primerOperador ? 'selected' : ''; // Si es el primer operador, agregar 'selected'
            selelct_operador.append(`<option value="${index}"` + selected + `>${value}</option>`);
            primerOperador = false; // Después del primer operador, establecer a false
        });
    }

    // --- Métodos Estáticos para Manejar Eventos de Click ---

    /**
     * Maneja el click en el botón para mostrar el formulario de creación de estrategias.
     * Muestra el div toggle y carga el contenido del formulario.
     */
    static handleCreateStrategyClick() {
        // Estas funciones showDivToggle parecen ser globales o parte de otro módulo.
        // Asumimos que están disponibles en el contexto donde se llama handleCreateStrategyClick.
        // Si no lo están, necesitarían ser importadas o pasadas como parámetros.
        if (typeof showDivToggle === 'function') {
            showDivToggle('showToggle');
            // Llama a setFunctionEstrategies para obtener el HTML del formulario
            const formHtml = Strategy.setFunctionEstrategies();
            showDivToggle('loadContent', 'Crear Estrategia', formHtml);
        } else {
            console.error("La función global 'showDivToggle' no está definida.");
            // Fallback o manejo de error alternativo si showDivToggle no está disponible
            alert("Error al intentar mostrar el formulario de creación de estrategias.");
        }
    }
}
