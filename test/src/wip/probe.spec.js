/* eslint-disable max-statements */
import {Probe} from 'probe.gl';
import test from 'tape-catch';

function getInstance() {
  return new Probe({
    id: 'test',
    isEnabled: true,
    isPrintEnabled: false,
    ignoreEnvironment: true
  });
}

test('Probe#VERSION', t => {
  const probe = getInstance();

  t.equal(typeof probe.VERSION, 'string', `VERSION is set: ${probe.VERSION}`);

  t.end();
});

test('Probe#probe', t => {
  const probe = getInstance();

  probe.probe('test');

  const log = probe.getLog();
  const row = log[0];

  t.equals(log.length, 1,
    'Expected row logged');
  t.equal(row.name, 'test',
    'Name logged');
  t.equal(typeof row.total, 'number', 'Start is set');
  t.equal(typeof row.delta, 'number', 'Delta is set');

  t.end();
});

test('Probe#probe - level methods', t => {
  const probe = getInstance().setLevel(3);

  probe.probe('test0');
  probe.probe1('test1');
  probe.probe2('test2');
  probe.probe3('test3');

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
  }

  t.end();
});

test('Probe#probe - level methods, lower level set', t => {
  const probe = getInstance().setLevel(1);

  probe.probe('test0');
  probe.probe1('test1');
  probe.probe2('test2');
  probe.probe3('test3');

  const log = probe.getLog();

  t.equals(log.length, 2,
    'Expected rows logged');
  t.deepEqual(
    log.map(row => row.level),
    [1, 1],
    'Levels match expected');

  t.end();
});

test('Probe#probe - level methods, disabled', t => {
  const probe = getInstance().disable();

  probe.probe('test0');
  probe.probe1('test1');
  probe.probe2('test2');
  probe.probe3('test3');

  const log = probe.getLog();

  t.equals(log.length, 0,
    'No rows logged');

  t.end();
});

test('Probe#sample - level methods', t => {
  const probe = getInstance().setLevel(3);

  probe.sample('test0');
  probe.sample1('test1');
  probe.sample2('test2');
  probe.sample3('test3');

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
    // t.equal(typeof row.averageTime, 'number', 'Avg time is set');
  }

  t.end();
});

/*
test('Probe#fps - level methods', t => {
  const probe = getInstance().setLevel(3);
  const count = 3;

  for (let i = 0; i < count; i++) {
    probe.fps('test0', {count});
    probe.fps1('test1', {count});
    probe.fps2('test2', {count});
    probe.fps3('test3', {count});
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

test('Probe#fps - log once per count', t => {
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

test('Probe#disable / Probe#enable', t => {
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

test('Probe#readBrokenEnvironment', t => {
  const probe = getInstance();
  probe._getConfigFromEnvironment = () => ({a: true});
  probe._initConfig();

  t.strictEqual(probe.getOption('a'), null,
    'Get broken option');

  t.end();
});

test('Probe#configure', t => {
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

test('Probe#xprobe - invoke', t => {
  const probe = getInstance().setLevel(1);

  probe.xprobe(1, 'test xprobe')();

  const log = probe.getLog();

  t.equals(log.length, 1,
    'Expected rows logged');

  t.end();
});

test('Probe#group - create, log, end', t => {
  const probe = getInstance().setLevel(1);

  const group = probe.group('test-group');
  group.probe(1, 'test0');
  group.end();

  const log = probe.getLog();

  t.equals(log.length, 1,
    'Expected rows logged');

  t.end();
});

test('Probe#getInteractiveRatio', t => {
  const probe = getInstance().setLevel(1);
  const percentage = probe.getInteractiveRatio();

  t.ok(percentage >= 0 && percentage <= 1, 'Expected 0-1');
  t.end();
});
*/
