import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        ...globals.jquery,
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
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
    },
  },
];
