import test from 'tape-promise/tape';
import {formatTime, formatMemory} from '@probe.gl/stats-widget/format-utils';

test('StatsWidget#formatTime', (t) => {
  t.equals(typeof formatTime, 'function', 'formatTime import OK');

  t.equals(formatTime(1), '1.00ms');
  t.equals(formatTime(100), '100.00ms');
  t.equals(formatTime(1000), '1.00s');
  t.equals(formatTime(10000), '10.00s');

  t.end();
});

test('StatsWidget#formatMemory', (t) => {
  t.equals(typeof formatMemory, 'function', 'formatMemory import OK');

  t.equals(formatMemory(1), '1 bytes');
  t.equals(formatMemory(1000), '1000 bytes');
  t.equals(formatMemory(1e6), '976.56kB');
  t.equals(formatMemory(1e8), '95.37MB');
  t.equals(formatMemory(1e12), '931.32GB');

  t.end();
});
