/**
 * Form handler registry - maps form identifiers to their handler functions
 */
const FORM_HANDLERS = {
    // Handlers by form ID
    ids: {
        'frm_complete_tag': (form) => User.handleCompleteTagSubmit(form),
        'loginform': (form) => User.handleLoginSubmit(form),
        'frm_crear_mazo': (form) => Deck.handleCreateDeckSubmit(form),
        'frm_crear_mazo_1_1': (form) => Deck.handleCreateDeckSubmit(form),
        'frm_ana_maz_ava': (form) => Deck.handleAnalyzeDeckSubmit(form)
    },

    // Handlers by form class
    classes: {
        'frm_get_coin': (form) => User.handleGetCoinSubmit(form),
        'frm_get_emogi': (form) => User.handleGetEmoteSubmit(form)
    }
};

/**
 * Handles form submission by checking for appropriate handlers
 * @param {jQuery} form - The form element
 * @returns {boolean} - True if a handler was found and executed
 */
function handleFormSubmission(form) {
    const formId = form.attr('id');
    const formClasses = form.attr('class')?.split(' ') || [];

    // Log form submission for debugging
    console.log(`Form submitted - ID: '${formId}', Classes: [${formClasses.join(', ')}]`);

    // Check for generic AJAX handler first
    if (form.data('ajax-success')) {
        submit(form.serialize(), form.data('ajax-success'), form, form.find('[type=submit]'));
        return true;
    }

    // Check for ID-based handler
    if (formId && FORM_HANDLERS.ids[formId]) {
        FORM_HANDLERS.ids[formId](form);
        return true;
    }

    // Check for class-based handler
    for (const className of formClasses) {
        if (FORM_HANDLERS.classes[className]) {
            FORM_HANDLERS.classes[className](form);
            return true;
        }
    }

    return false;
}

/**
 * Initializes the global form submit event handler
 */
export default function initEventSubmit() {
    $(document).on('submit', 'form', function (e) {
        e.preventDefault();

        const form = $(this);
        const wasHandled = handleFormSubmission(form);

        if (!wasHandled) {
            console.warn(`No handler found for form with ID '${form.attr('id')}' and classes '${form.attr('class') || 'none'}'`);
        }
    });
}
