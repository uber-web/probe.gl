/* eslint-disable max-statements */
import {Stats} from 'probe.gl';
import test from 'tape-catch';

test('Stats#import', t => {
  t.equals(typeof Stats, 'function', 'Stats import OK');
  t.end();
});

test('Stats#counting', t => {
  const stats = new Stats({id: 'test'});
  const counter = stats.get('test');
  t.doesNotThrow(() => counter.incrementCount(), 'stat.incrementCount works');
  t.doesNotThrow(() => counter.incrementCount(), 'stat.incrementCount works');
  t.doesNotThrow(() => counter.incrementCount(), 'stat.incrementCount works');
  t.equals(counter.count, 3, 'stat accumulates');
  t.doesNotThrow(() => counter.addCount(3), 'stat.add works');
  t.equals(counter.count, 6, 'stat accumulates');
  t.end();
});

test('Stats#timer()', t => {
  const stats = new Stats({id: 'test'});
  const timer = stats.get('test');
  t.doesNotThrow(() => timer.timeStart(), 'timer.timeStart works');
  t.doesNotThrow(() => timer.timeEnd(), 'timer.timeEnd works');
  t.doesNotThrow(() => timer.addTime(10), 'timer.addTime works');
  t.doesNotThrow(() => timer.getAverageTime(), 'timer.getAverageTime works');
  t.doesNotThrow(() => timer.getHz(), 'timer.getHz works');
  t.equals(timer.count, 2, 'timer counts');
  t.ok(timer.time > 0, 'timer times');
  t.ok(timer.getAverageTime() > 0, 'timer averages');
  t.ok(timer.getHz() > 0, 'timer calculates hz');
  t.end();
});

test('Stats#reset()', t => {
  const stats = new Stats({id: 'test'});
  const stat = stats.get('test');
  stat.incrementCount();
  stat.addTime(1);
  t.equals(stat.count, 2, 'stat setup OK');
  t.equals(stat.time, 1, 'stat setup OK');
  stats.reset();
  t.equals(stat.count, 0, 'stat reset OK');
  t.equals(stat.time, 0, 'stat reset OK');
  t.end();
});

test.only('Stats#sampleSize()', t => {
  const stats = new Stats({id: 'test'});
  const stat = stats.get('test').setSampleSize(3);
  stat.incrementCount();
  stat.addTime(1);
  t.equals(stat.count, 0, 'don\'t update count before sampling done');
  t.equals(stat.time, 0, 'don\'t update time before sampling done');
  stat.addTime(1);
  t.equals(stat.count, 3, 'update count after sampling done');
  t.equals(stat.time, 2, 'update time after sampling done');
  stat.addTime(1);
  stat.addTime(1);
  stat.addTime(1);
  t.equals(stat.lastSampleCount, 3, 'sampleCount only tracks last sampling');
  t.equals(stat.lastSampleTime, 3, 'sampleTime only tracks last sampling');
  t.equals(stat.count, 6, 'count tracks entire history');
  t.equals(stat.time, 5, 'time tracks entire history');
  t.end();
});
