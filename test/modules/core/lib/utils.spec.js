import test from 'tape-catch';
import {getHiResTimestamp} from 'probe.gl';

test('getHiResTimestamp', t => {
  const t1hr = getHiResTimestamp();
  const t1d = Date.now();
  t.equals(typeof getHiResTimestamp, 'function', 'getHiResTimestamp imported OK');
  t.equals(typeof getHiResTimestamp(), 'number', 'getHiResTimestamp returning time');
  const t2hr = getHiResTimestamp();
  const t2d = Date.now();
  t.ok(Math.abs(t2hr - t1hr - (t2d - t1d)) < 1, 'getHiResTimestamp is reporting time');
  t.end();
});
