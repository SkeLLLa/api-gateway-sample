module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
  },
  extends: ['plugin:prettier/recommended', 'eslint:recommended'],
  plugins: ['prettier', 'sort-requires'],
  env: {
    node: true,
    es6: true,
    browser: true,
  },
  overrides: [
    {
      files: ['**/*.spec.js', '**/__mocks__/**/*.js'],
      env: {
        jest: true,
      },
      plugins: ['jest'],
      ...require('eslint-plugin-jest').configs.recommended,
    },
  ],
};
