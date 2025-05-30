export default class Cookie {
    static setCookie(name, value, days) {
        console.log('setCookie(' + name + ', ' + value + ', ' + days + ')');
        let cookie = name + '=' + encodeURIComponent(value);
        if (days) {
            let expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + days);
            cookie += '; expires=' + expirationDate.toUTCString();
        }
        cookie += '; path=/';
        document.cookie = cookie;
    }

    static getCookie(name) {
        console.log('getCookie(' + name + ')');
        const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return cookieValue ? decodeURIComponent(cookieValue.pop()) : null;
    }

    static setCookiesForSession() { //Establecer cookies
        console.log('setCookiesForSession()');
        let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 3);
        Cookie.setCookie('Timezone', timezone);
    }

    static deleteAllCookies() { //eliminar todas las cokies
        console.log('deleteAllCookies()');
        let cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            let name = cookie.substring(0, cookie.indexOf("="));
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    }

    //funcion para retornar si se esta blokeando las cookies de terceros
    static isBlockingThirdPartyCookies() { //no funciona correctamente
        return navigator.cookieEnabled === false && typeof window.navigator.msSaveBlob !== "undefined";
    }
}