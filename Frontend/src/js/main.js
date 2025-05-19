import Cookie from './utilsjs/cookies.js';

async function initializeApp() {
  const csVersion = Cookie.getCookie('CSVersion') || "default";

  const modulePaths = [
    './config/Boot.js',
    './config/Config.js',
    './models/Chat.js',
    './models/Section.js',
    './models/Publication.js',
    './models/User.js',
    './models/Deck.js',
    './models/Card.js',
    './tools/Strategy.js',
    './utilsjs/api.js',
    './utilsjs/submit.js',
    './events/clickEvent.js',
    './events/otherEvent.js',
    './events/submitEvent.js',
  ];

  try {
    const modules = await Promise.all(
      modulePaths.map(path => import(`${path}?v=${csVersion}`))
    );

    const [
      BootModule, ConfigModule, ChatModule, SectionModule, PublicationModule, UserModule, DeckModule, CardModule, StrategyModule, apiModule,
      submitModule, clickEventModule, otherEventModule, submitEventModule
    ] = modules;

    window.Boot = BootModule.default;
    window.Config = ConfigModule.default;
    window.Chat = ChatModule.default;
    window.Section = SectionModule.default;
    window.Publication = PublicationModule.default;
    window.User = UserModule.default;
    window.Deck = DeckModule.default;
    window.Card = CardModule.default;
    window.Strategy = StrategyModule.default;
    window.api = apiModule.default;
    window.submit = submitModule.default;
    window.Cookie = Cookie;

    window.handleCredentialResponse = Config.handleCredentialResponse;
    window.addSlick = Config.addSlick;
    window.showDivToggle = Config.showDivToggle;

    submitEventModule.default();
    clickEventModule.default();
    otherEventModule.default();

    // Inicialización de la configuración del usuario
    User.toggleSounds(Cookie.getCookie('sound_effects'));
    Cookie.setCookiesForSession();

    //Espera la verificacion de una nueva version de la CS
    await api({ verCSVersion: true }, 'ver-vCS');

    // Bienvenida a un nuevo usuario
    (Config.urlParam.get('new_user') && Cookie.getCookie('bienvenida') === 'false') &&
      Boot.showInfBox('¡Bienvenido a Clash Strategic!', 'reyes_bienvenida.webp', Boot.msgInit, 60);

    // Bienvenida a los usuarios invitados
    Cookie.getCookie('TypeAcount') == 'invitado' && api({ PreCS: true }, 'show-pre');

    // Activa seccion de cartas
    $("#a_menu_cartas").click();
  } catch (error) {
    console.error("Error al cargar los módulos:", error);
    alert("Error al cargar la aplicación. Por favor, recarga la página o intenta más tarde.");
  }
}

$(document).ready(function () {
  initializeApp();
});
