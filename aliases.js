// Enables ES2015 import/export in Node.js
const path = require('path');

const ALIASES = {
  'probe.gl/test': path.resolve(__dirname, './src/test'),
  'probe.gl/bench': path.resolve(__dirname, './src/bench'),
  'probe.gl': path.resolve(__dirname, './src')
};

// Registers an alias for this module

if (module.require) {
  module.require('reify');

  const moduleAlias = module.require('module-alias');
  moduleAlias.addAliases(ALIASES);

  module.require('babel-polyfill');
}

module.exports = ALIASES;
