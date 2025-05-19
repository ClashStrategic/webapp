export default class Publication {

    //verificacion the new pub
    static loadNewPub() {
        console.log('loadNewPub()');
        (Config.jsonupdates.new_pub || Config.jsonupdates.new_enc) && api({ publicaciones: true, typePub: 'pubAll' }, 'pub-all');
    }

    //convertir a links
    static toLink(text) {
        console.log('toLink(' + text + ')');
        return text.replace(/((?:(?:https?|ftp):)?\/\/)?((?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.)+[a-z]{2,}|(?:\d{1,3}\.){3}\d{1,3})(?::\d{1,5})?(?:[/?#]\S*)?/g, function (match) {
            return '<a class="cs-link cs-link--default" href="' + match + '" target="_blank">' + match + '</a>';
        });
    }

    //funcion lazyloading
    static lazyloading() {
        console.log('lazyloading()');
        $('.pub_img, .avatar').each(function () {
            let isVisible = $(this).offset().top < $(window).scrollTop() + $(window).height() + 300;
            if (isVisible && !$(this).attr('src')) {
                $(this).attr('src', $(this).data('src'));
                $(this).removeAttr('data-src');
            }
        });
    }

    static setMinMaxEnc() {
        function getFormattedDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        }
        const now = new Date();// Calcular la fecha y hora mínima (24 horas en el futuro)
        const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);// Calcular la fecha y hora máxima (7 días en el futuro)
        const maxDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);// Establecer los valores min y max en el campo de entrada
        $('#frm_enc input[name="fecExp"]').attr({ min: getFormattedDate(minDate), max: getFormattedDate(maxDate) });// Asigna la fecha límite al atributo "max" del input
    }
}