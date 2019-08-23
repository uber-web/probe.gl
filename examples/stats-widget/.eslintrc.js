// prettier-ignore
// linting configs for react apps
module.exports = {
  plugins: ['react'],
  parser: 'babel-eslint',
  extends: ['uber-jsx', 'uber-es2015', 'prettier', 'prettier/react', 'plugin:import/errors'],
  overrides: {
    files: ['*.config.js'],
    rules: {
      'import/no-extraneous-dependencies': 0
    }
  },
  "settings": {
    "import/resolver": "webpack"
  },
  rules: {
    'guard-for-in': 0,
    'no-inline-comments': 0,
    'import/no-unresolved': 0,
    camelcase: 0,
    'import/no-extraneous-dependencies': ['error', {devDependencies: false, peerDependencies: true}]
  },
  parserOptions: {
    ecmaVersion: 2018
  }
};
