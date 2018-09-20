// Launch script for various Node test configurations

// Enables ES2015 import/export in Node.js
require('reify');

require('../aliases');

/* global process */
const path = require('path');
const moduleAlias = require('module-alias');

const mode = process.argv.length >= 3 ? process.argv[2] : 'default';
console.log(`Running ${mode} tests...`); // eslint-disable-line

switch (mode) {
case 'bench':
  require('./bench/index'); // Run the benchmarks
  break;

case 'log':
  require('./src/lib/raw-logging');
  break;

case 'test-dist':
  moduleAlias.addAlias('probe.gl', path.resolve('./dist/es5'));
  require('./test-index'); // Run the tests
  break;

case 'test':
default:
  require('./test-index'); // Run the tests
  break;
}
