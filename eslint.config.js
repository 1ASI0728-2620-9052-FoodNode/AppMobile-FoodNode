// ESLint 9 solo lee eslint.config.js. Este archivo reutiliza la configuración heredada de
// .eslintrc.js (reglas de capas DDD incluidas) mientras no se migre a formato flat.
const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');
const globals = require('globals');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  { ignores: ['node_modules/**', '.expo/**', 'coverage/**', 'dist/**'] },
  ...compat.config(require('./.eslintrc.js')),
  { files: ['**/__tests__/**/*.js'], languageOptions: { globals: globals.jest } },
];
