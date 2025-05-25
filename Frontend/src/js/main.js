import CookieModule from './utilsjs/cookies.js';
import BootModule from './config/Boot.js';
import ConfigModule from './config/Config.js';
import ChatModule from './models/Chat.js';
import SectionModule from './models/Section.js';
import PublicationModule from './models/Publication.js';
import UserModule from './models/User.js';
import DeckModule from './models/Deck.js';
import CardModule from './models/Card.js';
import StrategyModule from './tools/Strategy.js';
import apiModule from './utilsjs/api.js';
import submitModule from './utilsjs/submit.js';
import clickEventModule from './events/clickEvent.js';
import otherEventModule from './events/otherEvent.js';
import submitEventModule from './events/submitEvent.js';

try {
  window.Boot = BootModule;
  window.Config = ConfigModule;
  window.Chat = ChatModule;
  window.Section = SectionModule;
  window.Publication = PublicationModule;
  window.User = UserModule;
  window.Deck = DeckModule;
  window.Card = CardModule;
  window.Strategy = StrategyModule;
  window.api = apiModule;
  window.submit = submitModule;
  window.Cookie = CookieModule;

  submitEventModule();
  clickEventModule();
  otherEventModule();

  window.handleCredentialResponse = Config.handleCredentialResponse;
  window.addSlick = Config.addSlick;
  window.showDivToggle = Config.showDivToggle;

  // Inicialización de la configuración del usuario
  User.toggleSounds(Cookie.getCookie('sound_effects'));
  Cookie.setCookiesForSession();

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