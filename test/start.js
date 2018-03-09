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
  testLogging();
  break;

case 'test-dist':
  // Load deck.gl itself from the dist folder
  moduleAlias.addAlias('probe.gl', path.resolve('./dist'));
  require('./test-index'); // Run the tests
  break;

case 'test':
default:
  require('./test-index'); // Run the tests
  break;
}

function testLogging() {
  const {Log, COLOR} = require('probe.gl');
  const log = new Log({id: 'test'});
  log.priority = 5;

  log.probe('test0')();
  log.probe(1, 'test1')();
  log.probe(2, 'test2')();
  log.probe({priority: 3}, 'test3')();
  log.probe({color: 'green'}, 'test-green')();
  log.probe({color: COLOR.RED, message: 'test-red'})();

  log.log('log test')();
  log.log(0, 'log prio test')();

  log.log(() => 'log func test')();
  log.log(0, '() => log func prio test')();

  log.once('test once')();
  log.once('test once')();
  log.once('test twice')();
  log.once(0, 'test twice')();

  log.warn('test warn')();

  log.error('test error')();

  log.table(0, {a: {c: 1}, b: {c: 2}})();
  log.table(0, {a: {c: 1}, b: {c: 2}})();

  log.group('test-group')();
  log.log(1, 'test0')();
  log.groupEnd('test-group')();

}
