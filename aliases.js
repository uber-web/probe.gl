// Enables ES2015 import/export in Node.js
const path = require('path');

const ALIASES = {
  // Main lib
  'probe.gl': path.resolve(__dirname, './src')
};

// Registers an alias for this module

if (module.require) {
  module.require('reify');

  const moduleAlias = module.require('module-alias');
  moduleAlias.addAliases(ALIASES);
}

module.exports = ALIASES;
