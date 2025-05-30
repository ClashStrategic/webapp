import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        jQuery: 'readonly',
        $: 'readonly',
        Card: 'readonly',
        Deck: 'readonly',
        User: 'readonly',
        Config: 'readonly',
        Chat: 'readonly',
        Section: 'readonly',
        Publication: 'readonly',
        Strategy: 'readonly',
        Cookie: 'readonly',
        api: 'readonly',
        submit: 'readonly',
        showDivToggle: 'readonly',
        handleCredentialResponse: 'readonly',
        addSlick: 'readonly'
      }
    }
  },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-case-declarations": "off"
    }
  }
];
