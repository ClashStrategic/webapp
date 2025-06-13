import CookieModule from './utilsjs/cookies.js';
import ConfigModule from './utilsjs/Config.js';
import ChatModule from './models/Chat.js';
import SectionModule from './models/Section.js';
import PublicationModule from './models/Publication.js';
import UserModule from './models/User.js';
import DeckModule from './models/Deck.js';
import CardModule from './models/Card.js';
import StrategyModule from './utilsjs/Strategy.js';
import apiModule from './utilsjs/api.js';
import submitModule from './utilsjs/submit.js';
import clickEventModule from './events/clickEvent.js';
import otherEventModule from './events/otherEvent.js';
import submitEventModule from './events/submitEvent.js';

try {
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

  window.login = User.login;
  window.registerByGoogle = User.registerByGoogle;
  window.addSlick = Config.addSlick;
  window.showDivToggle = Config.showDivToggle;

  window.mainJsFullyLoaded = true;
  window.dispatchEvent(new CustomEvent('mainjsloaded'));
  console.log('[main.js] Módulos cargados correctamente.');
} catch (error) {
  console.error("Error al cargar los módulos:", error);
  alert("Error al cargar la aplicación. Por favor, recarga la página o intenta más tarde.");
}