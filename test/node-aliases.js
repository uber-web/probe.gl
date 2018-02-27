// Enables ES2015 import/export in Node.js
require('reify');

// Registers an alias for this module
const path = require('path');
const moduleAlias = require('module-alias');
moduleAlias.addAlias('probe.gl', path.resolve('./src'));
moduleAlias.addAlias('probe.gl/test', path.resolve('./src/test'));
moduleAlias.addAlias('probe.gl/bench', path.resolve('./src/bench'));

require('babel-polyfill');
