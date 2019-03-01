/* eslint-disable max-statements */
import {Stats} from 'probe.gl';
import test from 'tape-catch';

test('Stats#import', t => {
  t.equals(typeof Stats, 'function', 'Stats import OK');
  t.end();
});

test('Stats#accumulator', t => {
  const stats = new Stats({id: 'test'});
  const accumulator = stats.addAccumulator('test');
  t.doesNotThrow(() => accumulator.bump(), 'accumulator.bump works');
  t.doesNotThrow(() => accumulator.bump(), 'accumulator.bump works');
  t.doesNotThrow(() => accumulator.bump(), 'accumulator.bump works');
  t.equals(accumulator.total, 3, 'accumulator accumulates');
  t.doesNotThrow(() => accumulator.add(3), 'accumulator.add works');
  t.equals(accumulator.total, 6, 'accumulator accumulates');
  t.end();
});

test('Stats#timer()', t => {
  const stats = new Stats({id: 'test'});
  const timer = stats.addTimer('test');
  t.doesNotThrow(() => timer.timeStart(), 'timer.timeStart works');
  t.doesNotThrow(() => timer.timeEnd(), 'timer.timeEnd works');
  t.doesNotThrow(() => timer.addTime(10), 'timer.addTime works');
  t.doesNotThrow(() => timer.getAverage(), 'timer.getAverage works');
  t.doesNotThrow(() => timer.getHz(), 'timer.getHz works');
  t.equals(timer.count, 2, 'timer counts');
  t.ok(timer.time > 0, 'timer times');
  t.ok(timer.getAverage() > 0, 'timer averages');
  t.ok(timer.getHz() > 0, 'timer calculates hz');
  t.end();
});

test('Stats#reset()', t => {
  const stats = new Stats({id: 'test'});
  const accumulator = stats.addAccumulator('test');
  const timer = stats.addTimer('test');
  accumulator.bump();
  timer.addTime(1);
  t.equals(accumulator.total, 1, 'accumulator setup OK');
  t.equals(timer.count, 1, 'timer setup OK');
  stats.reset();
  t.equals(accumulator.total, 0, 'accumulator reset OK');
  t.equals(timer.count, 0, 'timer reset OK');
  t.end();
});
