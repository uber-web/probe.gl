import test from 'tape-catch';
import {_getHiResTimestamp} from '@probe.gl/stats';

test('_getHiResTimestamp', t => {
  const t1hr = _getHiResTimestamp();
  const t1d = Date.now();
  t.equals(typeof _getHiResTimestamp, 'function', '_getHiResTimestamp imported OK');
  t.equals(typeof _getHiResTimestamp(), 'number', '_getHiResTimestamp returning time');
  const t2hr = _getHiResTimestamp();
  const t2d = Date.now();
  t.ok(Math.abs(t2hr - t1hr - (t2d - t1d)) < 2, '_getHiResTimestamp is reporting time');
  t.end();
});
