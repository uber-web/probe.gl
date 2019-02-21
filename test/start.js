// Launch script for various Node test configurations

// Enables ES2015 import/export in Node.js
require('reify');

require('../aliases');

const {BrowserTestDriver} = require('@probe.gl/test-utils');

/* global process */
const path = require('path');
const moduleAlias = require('module-alias');

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
