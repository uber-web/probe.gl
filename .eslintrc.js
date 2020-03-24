module.exports = {
  extends: ['eslint-config-uber-es2015', 'prettier', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'guard-for-in': 0,
    'no-inline-comments': 0,
    camelcase: 0,
    'sort-vars': 0
  },
  env: {
    browser: true,
    node: true
  }
};
