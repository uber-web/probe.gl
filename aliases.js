// Enables ES2015 import/export in Node.js
const path = require('path');

const ALIASES = {
  // Main lib
  'probe.gl': path.resolve(__dirname, './modules/core/src'),
  '@probe.gl/bench': path.resolve(__dirname, './modules/bench/src'),
  '@probe.gl/test-utils': path.resolve(__dirname, './modules/test-utils/src')
};

// Registers an alias for this module

if (module.require) {
  module.require('reify');

  const moduleAlias = module.require('module-alias');
  moduleAlias.addAliases(ALIASES);
}

module.exports = ALIASES;
