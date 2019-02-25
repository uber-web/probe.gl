// Launch script for various Node test configurations

/* global process */
require('reify'); // Enables ES2015 import/export in Node.js
const moduleAlias = require('module-alias');
const path = require('path');
const {BrowserTestDriver} = require('@probe.gl/test-utils');
const ALIASES = require('../aliases');

moduleAlias.addAliases(ALIASES);

const mode = process.argv.length >= 3 ? process.argv[2] : 'default';
console.log(`Running ${mode} tests...`); // eslint-disable-line

switch (mode) {
  case 'bench':
    require('./bench/index'); // Run the benchmarks
    break;

  case 'bench-browser':
    new BrowserTestDriver().run({
      title: 'Benchmarks',
      server: {
        command: 'webpack-dev-server',
        arguments: ['--config', 'test/webpack.config.js', '--env.bench']
      },
      headless: false
    });
    break;

  case 'log':
    require('./modules/core/lib/raw-logging');
    break;

  case 'browser':
  case 'browser-headless':
    new BrowserTestDriver().run({
      title: 'Unit Tests',
      server: {
        command: 'webpack-dev-server',
        arguments: ['--config', 'test/webpack.config.js', '--env.test']
      },
      headless: mode === 'browser-headless'
    });
    break;

  case 'dist':
    moduleAlias.addAlias('probe.gl', path.resolve('./dist/es5'));
    require('./test-index'); // Run the tests
    break;

  case 'test':
  default:
    require('./test-index'); // Run the tests
    break;
}
