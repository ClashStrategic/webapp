export default function initEventSubmit() {
    $(document).on('submit', 'form', function (e) {
        e.preventDefault();
        const form = $(this);
        const formId = form.attr('id');
        const formClasses = form.attr('class') ? form.attr('class').split(' ') : [];
        console.log(`event-submit: ID='${formId}', Classes='${formClasses.join(', ')}'`);

        // Manejo genérico para formularios con data-ajax-success
        if (form.data('ajax-success')) {
            submit(form.serialize(), form.data('ajax-success'), form, form.find('[type=submit]'));
            // Considerar si estos formularios también deben ser manejados por los métodos estáticos
            // o si este manejo genérico es suficiente y exclusivo.
            // Por ahora, se asume que si tiene data-ajax-success, no necesita otro manejo.
            // return; // Descomentar si este manejo es exclusivo
        }

        // Manejo por clases de formulario
        formClasses.forEach(cls => {
            switch (cls) {
                case 'frm_get_coin':
                    User.handleGetCoinSubmit(form);
                    break;
                case 'frm_get_emogi':
                    User.handleGetEmoteSubmit(form);
                    break;
                /* case 'frm_Comentar': // Comentado como en el original
                    // Lógica original comentada
                    break; */
            }
        });

        // Manejo por ID de formulario
        switch (formId) {
            case 'frm_complete_tag':
                User.handleCompleteTagSubmit(form);
                break;
            case 'loginform':
                User.handleLoginSubmit(form);
                break;
            case 'frm_crear_mazo':
            case 'frm_crear_mazo_1_1':
                Deck.handleCreateDeckSubmit(form);
                break;
            case 'frm_ana_maz_ava':
                Deck.handleAnalyzeDeckSubmit(form);
                break;
            /*
            Casos comentados en el original:
            case 'frm_publicar':
                // Lógica original comentada
                break;
            case 'frm_camfot':
                // Lógica original comentada
                break;
            */
            default:
                // Opcional: Log para formularios no manejados explícitamente por ID o clase específica
                // if (!form.data('ajax-success') && !['frm_get_coin', 'frm_get_emogi'].some(cls => formClasses.includes(cls))) {
                //     console.log(`Formulario con ID '${formId}' no tiene un manejador específico.`);
                // }
                break;
        }
    });
}
