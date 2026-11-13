module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'prettier'],
  plugins: ['react', 'react-hooks'],
  env: { browser: true, es2021: true, node: true },
  settings: { react: { version: 'detect' } },
  parserOptions: { ecmaVersion: 2021, sourceType: 'module', ecmaFeatures: { jsx: true } },
  rules: { 'react/react-in-jsx-scope': 'off', 'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }] },
  overrides: [
    {
      files: ['src/contexts/*/domain/**/*.js', 'src/shared/kernel/**/*.js'],
      rules: {
        'no-restricted-imports': ['error', {
          patterns: [
            { group: ['react', 'react-native', 'axios', 'expo-*', 'h3-js', '@expo/*'], message: 'Domain layer must not import external libraries.' },
            { group: ['**/application/**', '**/infrastructure/**', '**/interfaces/**'], message: 'Domain layer must not import from other layers.' },
          ]
        }]
      }
    },
    {
      files: ['src/contexts/*/application/**/*.js'],
      rules: {
        'no-restricted-imports': ['error', {
          patterns: [
            { group: ['react', 'react-native', 'axios', 'expo-*', '@expo/*'], message: 'Application layer must not import UI or HTTP libraries.' },
            { group: ['**/infrastructure/**', '**/interfaces/**'], message: 'Application layer must not import from infrastructure or interfaces.' },
          ]
        }]
      }
    },
    {
      files: ['src/contexts/*/interfaces/**/*.jsx', 'src/contexts/*/interfaces/**/*.js'],
      rules: {
        'no-restricted-imports': ['error', {
          patterns: [
            { group: ['**/infrastructure/**'], message: 'Interfaces layer must not import from infrastructure.' },
          ]
        }]
      }
    }
  ]
};

