/* eslint-disable max-statements */
import {Stats, Stat} from 'probe.gl';
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
  t.equals(timer.samples, 2, 'timer udpates samples');
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
  t.equals(stat.count, 1, 'stat setup OK');
  t.equals(stat.time, 1, 'stat setup OK');
  stats.reset();
  t.equals(stat.count, 0, 'stat reset OK');
  t.equals(stat.time, 0, 'stat reset OK');
  t.end();
});

test('Stats#timing sampleSize', t => {
  const stats = new Stats({id: 'test'});
  const stat = stats.get('test').setSampleSize(3);
  stat.addTime(1);
  stat.addTime(1);
  t.equals(stat.time, 0, "don't update time before sampling done");
  stat.addTime(1);
  t.equals(stat.time, 3, 'update time after sampling done');
  stat.addTime(1);
  stat.addTime(1);
  stat.addTime(1);
  t.equals(stat.lastSampleTime, 3, 'lastSampleTime only tracks last sampling');
  t.equals(stat.time, 6, 'time tracks entire history');
  t.end();
});

test('Stats#timing sampleSize', t => {
  const stats = new Stats({id: 'test'});
  const stat = stats.get('test').setSampleSize(3);
  stat.incrementCount();
  stat.incrementCount();
  t.equals(stat.count, 0, "don't update count before sampling done");
  stat.incrementCount();
  t.equals(stat.count, 3, 'update count after sampling done');
  stat.incrementCount();
  stat.incrementCount();
  stat.incrementCount();
  t.equals(stat.lastSampleCount, 3, 'lastSampleCount only tracks last sampling');
  t.equals(stat.count, 6, 'count tracks entire history');
  t.end();
});

test('Stats#constructore with stats', t => {
  const statsContent = new Stats({
    id: 'test',
    stats: [
      new Stat('stat-1'),
      {
        name: 'stat-2',
        type: 'memory'
      },
      {
        id: 'stat-3'
      },
      {
        name: 'stat-2',
        type: 'fps'
      }
    ]
  });

  const stats = new Stats({id: 'test', stats: statsContent});

  t.equals(stats.size, 2, 'Should dedupe and ignore stat without name.');

  let stat = stats.get('stat-1');
  t.equals(stat.name, 'stat-1', 'Should correctly set stat-1 name.');

  stat = stats.get('stat-2');
  t.equals(stat.name, 'stat-2', 'Should correctly set stat-2 name.');
  t.equals(stat.type, 'memory', 'Should correctly set stat-2 type.');

  t.end();
});
