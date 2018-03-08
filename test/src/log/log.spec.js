/* eslint-disable max-statements */
import {Log} from 'probe.gl';
import test from 'tape-catch';

const makeOpts = (priority, message, ...args) => ({priority, message, args});

const OPTIONS_TEST_CASES = [
  {
    args: makeOpts(1, 'Hi', 0, 1),
    opts: {priority: 1, message: 'Hi', args: [0, 1]}
  },
  {
    args: makeOpts('Hi', 0, 1),
    opts: {priority: 0, message: 'Hi', args: [0, 1]}
  },
  {
    args: makeOpts({}, 'Hi', 0, 1),
    opts: {priority: 0, message: 'Hi', args: [0, 1]}
  },
  {
    args: makeOpts({priority: 3, color: 'green'}, 'Hi', 0, 1),
    opts: {priority: 3, color: 'green', message: 'Hi', args: [0, 1]}
  },
  {
    args: makeOpts({priority: 3, color: 'green', message: 'Hi', args: [0, 1]}),
    opts: {priority: 3, color: 'green', message: 'Hi', args: [0, 1]}
  }
];

function getInstance() {
  return new Log({
    id: 'test',
    isEnabled: true,
    isPrintEnabled: false,
    ignoreEnvironment: true
  });
}

// tape tests swallow console messages, do some raw logging to check that things work
function rawLogging() {
  const log = getInstance().setLevel(3);

  log.probe('test0')();
  log.probe(1, 'test1')();
  log.probe(2, 'test2')();
  log.probe({priority: 3}, 'test3')();
  log.probe({color: 'green'}, 'test-green')();
}

rawLogging();

test('Log#import', t => {
  t.equals(typeof Log, 'function',
    'Expected row logged');
  t.end();
});

test('Log#_getOpts', t => {
  const log = new Log({id: 'test'});
  for (const tc of OPTIONS_TEST_CASES) {
    const opts = log._getBaseOpts(tc.args);
    t.deepEqual(opts, tc.opts,
      `log(${JSON.stringify(tc.args)}) => ${JSON.stringify(opts)} args parsed correctly`);
  }
  t.end();
});

test('Log#log', t => {
  const log = new Log({id: 'test'});
  t.ok(log instanceof Log, 'log created successfully');
  t.doesNotThrow(() => log.log('test'), 'log.log works');
  t.doesNotThrow(() => log.log(0, 'test'), 'log.log works');
  t.end();
});

test('Log#log(functions)', t => {
  const log = new Log({id: 'test'});
  t.ok(log instanceof Log, 'log created successfully');
  t.doesNotThrow(() => log.log(() => 'test'), 'log.log works');
  t.doesNotThrow(() => log.log(0, '() => test'), 'log.log works');
  t.end();
});

test('Log#once', t => {
  const log = new Log({id: 'test'});
  t.ok(log instanceof Log, 'log created successfully');
  t.doesNotThrow(() => log.once('test'), 'log.once works');
  t.doesNotThrow(() => log.once(0, 'test'), 'log.once works');
  t.end();
});

test('Log#warn', t => {
  const log = new Log({id: 'test'});
  t.ok(log instanceof Log, 'log created successfully');
  t.doesNotThrow(() => log.warn('test'), 'log.warn works');
  // t.throws(() => log.warn(0, 'test'), 'log.warn works');
  t.end();
});

test('Log#error', t => {
  const log = new Log({id: 'test'});
  t.ok(log instanceof Log, 'log created successfully');
  t.doesNotThrow(() => log.error('test'), 'log.error works');
  // t.throws(() => log.error(0, 'test'), 'log.error works');
  t.end();
});

test('Log#table', t => {
  const log = new Log({id: 'test'});
  t.ok(log instanceof Log, 'log created successfully');
  t.doesNotThrow(() => log.table(0, {a: {c: 1}, b: {c: 2}}), 'log.table works');
  t.doesNotThrow(() => log.table(0, {a: {c: 1}, b: {c: 2}}), 'log.table(columns) works');
  // t.throws(() => log.error(0, 'test'), 'log.error works');
  t.end();
});

/*
test('Log#probe', t => {
  const probe = getInstance();

  log.probe('test')();

  // const log = probe.getLog();
  // const row = log[0];

  // t.equals(log.length, 1,
  //   'Expected row logged');
  // t.equal(row.name, 'test',
  //   'Name logged');
  // t.equal(typeof row.total, 'number', 'Start is set');
  // t.equal(typeof row.delta, 'number', 'Delta is set');

  t.end();
});

test('Log#probe - level methods', t => {
  const probe = getInstance().setLevel(3);

  probe.probe('test0')();
  probe.probe(1, 'test1')();
  probe.probe(2, 'test2')();
  probe.probe(3, 'test3')();

  // const log = probe.getLog();

  // t.equals(log.length, 4,
  //   'Expected rows logged');
  // t.deepEqual(
  //   log.map(row => row.level),
  //   [1, 1, 2, 3],
  //   'Levels match expected');
  // t.deepEqual(
  //   log.map(row => row.name),
  //   ['test0', 'test1', 'test2', 'test3'],
  //   'Names match expected');

  // for (const row of log) {
  //   t.equal(typeof row.total, 'number', 'Start is set');
  //   t.equal(typeof row.delta, 'number', 'Delta is set');
  // }

  t.end();
});

test('Log#probe - level methods, lower level set', t => {
  const probe = getInstance().setLevel(1);

  probe.probe('test0')();
  probe.probe(1, 'test1')();
  probe.probe(2, 'test2')();
  probe.probe(3, 'test3')();

  // const log = probe.getLog();

  // t.equals(log.length, 2,
  //   'Expected rows logged');
  // t.deepEqual(
  //   log.map(row => row.level),
  //   [1, 1],
  //   'Levels match expected');

  t.end();
});

test('Log#probe - level methods, disabled', t => {
  const probe = getInstance().enable(false);

  probe.probe('test0')();
  probe.probe(1, 'test1')();
  probe.probe(2, 'test2')();
  probe.probe(3, 'test3')();

  // const log = probe.getLog();

  // t.equals(log.length, 0,
  //   'No rows logged');

  t.end();
});

// test('Log#sample - level methods', t => {
//   const probe = getInstance().setLevel(3);

//   probe.sample('test0')();
//   probe.sample(1, 'test1')();
//   probe.sample(2, 'test2')();
//   probe.sample(3, 'test3')();

  // const log = probe.getLog();

  // t.equals(log.length, 4,
  //   'Expected rows logged');
  // t.deepEqual(
  //   log.map(row => row.level),
  //   [1, 1, 2, 3],
  //   'Levels match expected');
  // t.deepEqual(
  //   log.map(row => row.name),
  //   ['test0', 'test1', 'test2', 'test3'],
  //   'Names match expected');

  // for (const row of log) {
  //   t.equal(typeof row.total, 'number', 'Start is set');
  //   t.equal(typeof row.delta, 'number', 'Delta is set');
  //   // t.equal(typeof row.averageTime, 'number', 'Avg time is set');
  // }

//   t.end();
// });

/*
test('Log#fps - level methods', t => {
  const probe = getInstance().setLevel(3);
  const count = 3;

  for (let i = 0; i < count; i++) {
    probe.fps('test0', {count});
    probe.fps(1, 'test1', {count});
    probe.fps(2, 'test2', {count});
    probe.fps(3, 'test3', {count});
  }

  const log = probe.getLog();

  t.equals(log.length, 4,
    'Expected rows logged');
  t.deepEqual(
    log.map(row => row.level),
    [1, 1, 2, 3],
    'Levels match expected');
  t.deepEqual(
    log.map(row => row.name),
    ['test0', 'test1', 'test2', 'test3'],
    'Names match expected');

  for (const row of log) {
    t.equal(typeof row.total, 'number', 'Start is set');
    t.equal(typeof row.delta, 'number', 'Delta is set');
    t.equal(typeof row.fps, 'number', 'FPS is set');
  }

  t.end();
});

test('Log#fps - log once per count', t => {
  const probe = getInstance().setLevel(3);
  const count = 3;
  const cycles = 4;
  // TODO - add test for head parameter

  for (let i = 0; i < count * cycles; i++) {
    probe.fps('test', {count});
  }

  const log = probe.getLog();

  t.equals(log.length, cycles,
    'Expected rows logged');

  for (const row of log) {
    t.equal(typeof row.total, 'number', 'Start is set');
    t.equal(typeof row.delta, 'number', 'Delta is set');
    t.equal(typeof row.fps, 'number', 'FPS is set');
  }

  t.end();
});

test('Log#disable / Log#enable', t => {
  const probe = getInstance();

  t.strictEqual(probe.isEnabled(), true,
    'isEnabled matches expected');

  probe.disable();
  probe.probe('test_disabled');

  t.strictEqual(probe.isEnabled(), false,
    'isEnabled matches expected');
  t.strictEqual(probe.getLog().length, 0,
    'No row logged');

  probe.enable();
  probe.probe('test_enabled');

  t.strictEqual(probe.isEnabled(), true,
    'isEnabled matches expected');
  t.strictEqual(probe.getLog().length, 1,
    'Row logged');
  t.strictEqual(probe.getLog()[0].name, 'test_enabled',
    'Row name matches expected');

  t.end();
});

test('Log#readBrokenEnvironment', t => {
  const probe = getInstance();
  probe._getConfigFromEnvironment = () => ({a: true});
  probe._initConfig();

  t.strictEqual(probe.getOption('a'), null,
    'Get broken option');

  t.end();
});

test('Log#configure', t => {
  const probe = getInstance()
    .configure({
      level: 2,
      foo: 'bar'
    });

  t.strictEqual(probe.getOption('level'), 2,
    'Set known option');
  t.strictEqual(probe.getOption('foo'), 'bar',
    'Set unknown option');

  t.end();
});

test('Log#xprobe - invoke', t => {
  const probe = getInstance().setLevel(1);

  probe.xprobe(1, 'test xprobe')();

  const log = probe.getLog();

  t.equals(log.length, 1,
    'Expected rows logged');

  t.end();
});

test('Log#group - create, log, end', t => {
  const probe = getInstance().setLevel(1);

  const group = probe.group('test-group');
  group.probe(1, 'test0');
  group.end();

  const log = probe.getLog();

  t.equals(log.length, 1,
    'Expected rows logged');

  t.end();
});

test('Log#getInteractiveRatio', t => {
  const probe = getInstance().setLevel(1);
  const percentage = probe.getInteractiveRatio();

  t.ok(percentage >= 0 && percentage <= 1, 'Expected 0-1');
  t.end();
});
*/
