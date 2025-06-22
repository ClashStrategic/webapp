## [1.1.1](https://github.com/ClashStrategic/webapp/compare/v1.1.0...v1.1.1) (2025-06-22)


### Bug Fixes

* **cards:** exclude tower slot from deck data and save changes after move ([d9a647c](https://github.com/ClashStrategic/webapp/commit/d9a647c174d7992697f07a1c2452d1c101ee9c6f))
* **cards:** prevent empty slot clicks during deck updates ([8263e6f](https://github.com/ClashStrategic/webapp/commit/8263e6f2ea037b672938f4906a716590d3808884))
* **Cards:** Prevent moving cards to tower slot in Card.js ([eec2b7e](https://github.com/ClashStrategic/webapp/commit/eec2b7e945af3427a1a0734e0aa56f779a0c0721))
* **cards:** prevent tower cards from being selected for move ([8d43606](https://github.com/ClashStrategic/webapp/commit/8d43606f4b3368df38b604e04a91ff42be5b7922))
* **Cards:** Update deck saving logic to check for completeness ([f377816](https://github.com/ClashStrategic/webapp/commit/f3778166c8482074879014b59190f47d63c2ad4e))
* **deck:** optimize database saves by checking for actual changes ([02f065d](https://github.com/ClashStrategic/webapp/commit/02f065d96168f94e742677c765ff31833d817e96))
* **events:** improve click event handling with proper event parameter passing ([8ca499e](https://github.com/ClashStrategic/webapp/commit/8ca499e52c88dbc72d7c0cee83feab02d5453723))

# [1.1.0](https://github.com/ClashStrategic/webapp/compare/v1.0.1...v1.1.0) (2025-06-20)


### Bug Fixes

* **ui:** correct Spanish text with proper accents and improve consistency ([263429c](https://github.com/ClashStrategic/webapp/commit/263429c9a523b70baf80f5b1139c71e518612aee))


### Features

* **ui:** add collapsible deck analysis section with toggle button ([f8909a0](https://github.com/ClashStrategic/webapp/commit/f8909a0f303937305321dbc5b2741e52baf65671))
* **ui:** add deck statistics display to card section ([e2eed79](https://github.com/ClashStrategic/webapp/commit/e2eed795d6b8e74f8c9d4abfa07758de7c3ac1c4))

## [1.0.1](https://github.com/ClashStrategic/webapp/compare/v1.0.0...v1.0.1) (2025-06-17)


### Bug Fixes

* Use 'invitado' for guest user check in HomeView ([00a2ac7](https://github.com/ClashStrategic/webapp/commit/00a2ac7c9a9b6c57c2234579a735007129de5ec3))

# [1.0.0](https://github.com/ClashStrategic/webapp/compare/v0.6.5...v1.0.0) (2025-06-17)


### Bug Fixes

* **Cards:** Eliminates unnecessary for when setting up cards ([422b39e](https://github.com/ClashStrategic/webapp/commit/422b39e0548f56eb53d0888d2ed47ccc20de1bef))
* **Deck:** Ensure Mazos cookie initializes correctly for guests ([5d81885](https://github.com/ClashStrategic/webapp/commit/5d81885a2ece1a0942fde944e2a80351251dca74))
* **Deck:** Update API call for deck analysis functionality ([4742400](https://github.com/ClashStrategic/webapp/commit/4742400c88956b94e5c09964a110d05b4bce1a5c))
* Integrates the letter's media data into the data-json attribute and improves the log messages for the json values ​​so they can be displayed correctly in the console. ([1860a5b](https://github.com/ClashStrategic/webapp/commit/1860a5b051324d06d883422cd4d91dac43240321))


### Code Refactoring

* **api:** require explicit HTTP method for all API calls ([1d20fea](https://github.com/ClashStrategic/webapp/commit/1d20feab756056c7236373201c17153c1675da93))


### Features

* **api-v1:** Add url parameter and restructure api function signature ([860a4e6](https://github.com/ClashStrategic/webapp/commit/860a4e6ef1486f35f005ee8c85a061a58d93ac9c))
* **cache templates:** Add `src/templates` to directories scanned by URL lister ([5e415a4](https://github.com/ClashStrategic/webapp/commit/5e415a4cc70be03418e7efb4180330d2bc1cd89f))
* **cards:** Render card collection using client-side templates ([b80bf48](https://github.com/ClashStrategic/webapp/commit/b80bf480e8cb881cda5083c9732da8972aa742cf))
* **Config:** add async template rendering method ([5381efc](https://github.com/ClashStrategic/webapp/commit/5381efc2282898ee9f0893b532dfec7d3ef45ad5))
* **DeckAnalysis:** Implement dynamic rendering for analysis view ([9a7fc57](https://github.com/ClashStrategic/webapp/commit/9a7fc57e1a5c8b0a468bec9b80b47d69ff17bf56))
* **Info-Cards:** Implement detailed card statistics view ([31b9d2e](https://github.com/ClashStrategic/webapp/commit/31b9d2eb2af10e23480e4924400b32878e8104c7))
* **main:** Add mainJsFullyLoaded event and log message ([a5cfcb6](https://github.com/ClashStrategic/webapp/commit/a5cfcb67cc963797975ae517b272576f8d239920))
* Render About Us content via client-side template ([90ecfcd](https://github.com/ClashStrategic/webapp/commit/90ecfcdac3f7786a426a60ae1dd84fd1790185cf))
* **shop:** Load shop content via dedicated products API ([922338a](https://github.com/ClashStrategic/webapp/commit/922338a4ee61f042059184d9994e891a9bc3805c))
* **templates:** Add several views that were in API as MVC to render it from webapp. ([d038d52](https://github.com/ClashStrategic/webapp/commit/d038d52292042f5a4044d4e8938f82696b8c74c9))


### BREAKING CHANGES

* **api:** The api utility function now requires the HTTP method (e.g., 'GET', 'POST') as its first argument.
All existing calls to api(...) have been updated to use the new signature, e.g., api('GET', '/endpoint').

This change enhances clarity and maintainability by making the request type explicit, reducing ambiguity, and enabling more robust request handling logic in the future.
* **api-v1:** The api() function signature has changed:
- Now requires mandatory url parameter as first argument
- Type parameter moved to second position (also mandatory)

## [0.6.5](https://github.com/ClashStrategic/webapp/compare/v0.6.4...v0.6.5) (2025-06-02)


### Bug Fixes

* **base_url_api:** Modify API base URL configuration for local and production ([d6a125e](https://github.com/ClashStrategic/webapp/commit/d6a125ef79bc87a9afe041a83048b3d3c29a0626))

## [0.6.4](https://github.com/ClashStrategic/webapp/compare/v0.6.3...v0.6.4) (2025-06-02)


### Bug Fixes

* **home:** correct base URL for API in local storage ([1d09d4f](https://github.com/ClashStrategic/webapp/commit/1d09d4f5f495a6bf8afe9f80df9285c450bf529c))

## [0.6.3](https://github.com/ClashStrategic/webapp/compare/v0.6.2...v0.6.3) (2025-05-29)


### Bug Fixes

* **Deck:** correct gem cost retrieval in deck creation confirmation ([56a37da](https://github.com/ClashStrategic/webapp/commit/56a37da5119664fb488c50547dd5b15afaa499bd))
* **Deck:** update gem cost for advanced analysis ([88f81ec](https://github.com/ClashStrategic/webapp/commit/88f81ec0ed1459bd15b1476d624a2ae0aa38da85))

## [0.6.2](https://github.com/ClashStrategic/webapp/compare/v0.6.1...v0.6.2) (2025-05-27)


### Bug Fixes

* **sw:** include version in update alert message ([1dbd619](https://github.com/ClashStrategic/webapp/commit/1dbd619e86172447948fd44612986cd02217f431))

## [0.6.1](https://github.com/ClashStrategic/webapp/compare/v0.6.0...v0.6.1) (2025-05-27)


### Bug Fixes

* **home:** Integrate the initial HTML with dependencies to avoid errors with scripts ([0d5b304](https://github.com/ClashStrategic/webapp/commit/0d5b30482c7413d9c8fef17b3ccc0d6f3945685a))

# [0.6.0](https://github.com/ClashStrategic/webapp/compare/v0.5.0...v0.6.0) (2025-05-26)


### Features

* **sw:** enhance service worker update handling ([49e2a49](https://github.com/ClashStrategic/webapp/commit/49e2a495c460ded535cfa90ba62be1eb60f618ca))

# [0.5.0](https://github.com/ClashStrategic/webapp/compare/v0.4.3...v0.5.0) (2025-05-26)


### Features

* **sw:** store service worker (webapp) version and build datetime ([0cbc3a1](https://github.com/ClashStrategic/webapp/commit/0cbc3a14831fdf7c8d52adb188ba65ccdf551a93))

## [0.4.3](https://github.com/ClashStrategic/webapp/compare/v0.4.2...v0.4.3) (2025-05-26)


### Bug Fixes

* **api:** remove version check from API response handling ([96bac2c](https://github.com/ClashStrategic/webapp/commit/96bac2cb84d6d596c466cbee7cc00f5c09e07ad3))
* **sw:** update service worker registration and caching logic ([e94c752](https://github.com/ClashStrategic/webapp/commit/e94c7525ef46bbc4dde8c2a70cfed126878bb15b))

## [0.4.2](https://github.com/ClashStrategic/webapp/compare/v0.4.1...v0.4.2) (2025-05-23)


### Bug Fixes

* **tooltip:** Activate fading by pressing outside the tooltip when it is in the general toggle ([0a1a3ce](https://github.com/ClashStrategic/webapp/commit/0a1a3ce2958f6fc1b1fbaf195f18b98ce0750f39))

## [0.4.1](https://github.com/ClashStrategic/webapp/compare/v0.4.0...v0.4.1) (2025-05-23)


### Bug Fixes

* **privacy:** add comprehensive privacy policy document ([52a99b1](https://github.com/ClashStrategic/webapp/commit/52a99b1ed7d8f4c7d5fae9d850f1a24069aa0a49))

# [0.4.0](https://github.com/ClashStrategic/webapp/compare/v0.3.0...v0.4.0) (2025-05-22)


### Bug Fixes

* **home:** store API base URL in localStorage for fetch ([3eb00a7](https://github.com/ClashStrategic/webapp/commit/3eb00a7e571abea0c8d1d4ba3932fb450e3f877c))


### Features

* Configure dynamic API base URL and fetch home content ([3800d67](https://github.com/ClashStrategic/webapp/commit/3800d6716d5364d9d5a1678876da72ae850ba079))

# [0.3.0](https://github.com/ClashStrategic/webapp/compare/v0.2.0...v0.3.0) (2025-05-21)


### Features

* **htaccess, error pages:** add server configuration and error pages ([ca4b0b8](https://github.com/ClashStrategic/webapp/commit/ca4b0b81c2f64672c9397c6f92c56a4353eb7ab7))

# [0.2.0](https://github.com/ClashStrategic/webapp/compare/v0.1.0...v0.2.0) (2025-05-21)


### Features

* add robots.txt for bot access control and sitemap.xml for better indexing ([e1cd5a6](https://github.com/ClashStrategic/webapp/commit/e1cd5a69ffec4481cc18f202b0e11ff54161d0d7))
